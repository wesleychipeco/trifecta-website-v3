import axios from "axios";
import { FANTRAX_URL_STRING } from "../NewConstants.js";
import { stringToFloatWithRounding } from "../utils/StringsUtils.js";

export const scrapePlayerStats = async (leagueId, teamId) => {
  const backendUrl = `${FANTRAX_URL_STRING}${leagueId}`;
  const body = {
    msgs: [
      {
        method: "getTeamRosterInfo",
        data: {
          leagueId: leagueId,
          statsType: "3",
          scoringCategoryType: "5",
          teamId: teamId,
          timeframeTypeCode: "YEAR_TO_DATE",
        },
      },
    ],
    ng2: true,
    refUrl: `https://www.fantrax.com/fantasy/league/${leagueId}/team/roster;statsType=3;scoringCategoryType=5?pendingTransactions=false`,
    dt: 0,
    at: "3.0",
    av: null,
    tz: "America/Los_Angeles",
    v: "73.0.0",
  };

  return axios.post(backendUrl, body);
};

export const filterPlayers = (apiData, sport) => {
  const playerRows =
    apiData?.data?.responses?.[0]?.data?.tables?.[0]?.rows ?? [];
  // filter for only rows with players with names
  let filteredPlayerStats = playerRows.filter((eachRow) => {
    const playerName = eachRow?.scorer?.name ?? "";
    return playerName.length > 0;
  });

  // for baseball, need to go to tables[1] to get pitchers
  if (sport === "baseball") {
    const pitcherRows =
      apiData?.data?.responses?.[0]?.data?.tables?.[1]?.rows ?? [];
    const pitcherFilteredPlayerStats = pitcherRows.filter((eachRow) => {
      const playerName = eachRow?.scorer?.name ?? "";
      return playerName.length > 0;
    });
    filteredPlayerStats = [
      ...filteredPlayerStats,
      ...pitcherFilteredPlayerStats,
    ];
  }
  return filteredPlayerStats;
};

export const compileBasketballStats = (row, gmName, year) => {
  const PRIMARY_POSITIONS = ["PG", "SG", "SF", "PF", "C"];
  const { scorer, cells } = row;
  const { name, posShortNames, teamShortName } = scorer;
  const positionsList = posShortNames.split(",");
  const primaryPositionsList = positionsList.filter((pos) =>
    PRIMARY_POSITIONS.includes(pos)
  );

  const [
    ageObject,
    gamesPlayedObject,
    fgPerObject,
    threepmObject,
    ftPerObject,
    pointsObject,
    reboundsObject,
    assistsObject,
    stealsObject,
    blocksObject,
    turnoversObject,
  ] = cells;

  if (gamesPlayedObject.content === "" || gamesPlayedObject.content === "0") {
    return null;
  }

  return {
    gmName,
    year,
    name,
    position: primaryPositionsList.join(","),
    teamName: teamShortName,
    age: parseInt(ageObject.content),
    gamesPlayed: parseInt(gamesPlayedObject.content.replace(",", "")),
    fgPer: parseFloat(fgPerObject.content).toFixed(3),
    ftPer: parseFloat(ftPerObject.content).toFixed(3),
    threepm: parseInt(threepmObject.content.replace(",", "")),
    points: parseInt(pointsObject.content.replace(",", "")),
    rebounds: parseInt(reboundsObject.content.replace(",", "")),
    assists: parseInt(assistsObject.content.replace(",", "")),
    steals: parseInt(stealsObject.content.replace(",", "")),
    blocks: parseInt(blocksObject.content.replace(",", "")),
    turnovers: parseInt(turnoversObject.content.replace(",", "")),
  };
};

export const compileBaseballStats = (row, gmName, year) => {
  const { scorer, cells } = row;
  const { name, posShortNames, teamShortName } = scorer;
  const positionsList = posShortNames.split(",");
  if (
    (positionsList.includes("SP") ||
      positionsList.includes("RP") ||
      positionsList.includes("P")) &&
    name !== "Shohei Ohtani"
  ) {
    // pitcher
    const [
      ageObject,
      inningsPitchedObject,
      winsObject,
      qualityStartObject,
      ksObject,
      eraObject,
      whipObject,
      savesHoldsObject, // H // AB // R // RBI // HR // SO // OBP
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      gamesPlayedObject,
    ] = cells;

    if (gamesPlayedObject.content === "" || gamesPlayedObject.content === "0") {
      return null;
    }

    // reverse engineer earned runs and walks + hits from IP, ERA, and WHIP
    const ipString = inningsPitchedToNumberConverter(
      inningsPitchedObject.content
    );
    const ip = stringToFloatWithRounding(ipString, 3);
    const era = stringToFloatWithRounding(eraObject.content, 2);
    const whip = stringToFloatWithRounding(whipObject.content, 3);
    const earnedRuns = Math.round((era * ip) / 9);
    const walksPlusHits = Math.round(ip * whip);

    return {
      gmName,
      year,
      name,
      position: posShortNames,
      teamName: teamShortName,
      type: "pitcher",
      age: parseInt(ageObject.content),
      gamesPlayed: parseInt(gamesPlayedObject.content.replace(",", "")),
      plateAppearances: "--",
      timesOnBase: "--",
      runs: "--",
      homeRuns: "--",
      rbi: "--",
      strikeouts: "--",
      stolenBases: "--",
      obp: "--",
      ip: stringToFloatWithRounding(inningsPitchedObject.content, 1),
      ipNumber: ip,
      qualityStarts: parseInt(qualityStartObject.content.replace(",", "")),
      wins: parseInt(winsObject.content.replace(",", "")),
      ks: parseInt(ksObject.content.replace(",", "")),
      savesHolds: parseInt(savesHoldsObject.content.replace(",", "")),
      era,
      whip,
      earnedRuns,
      walksPlusHits,
    };
  } else {
    // hitter
    const [
      ageObject,
      atBatsObject,
      hitsObject,
      runsObject,
      homeRunsObject,
      rbiObject,
      strikeoutsObject,
      stolenBasesObject,
      obpObject,
      gamesPlayedObject,
    ] = cells;

    if (gamesPlayedObject.content === "" || gamesPlayedObject.content === "0") {
      return null;
    }

    // reverse engineer plate appearances and times on base by inferring walks from hits, at bats and obp
    const hits = parseInt(hitsObject.content.replace(",", ""));
    const atBats = parseInt(atBatsObject.content.replace(",", ""));
    const obp = stringToFloatWithRounding(obpObject.content, 3);
    const walks = Math.round((hits - obp * atBats) / (obp - 1));
    const plateAppearances = walks + atBats;
    const timesOnBase = hits + walks;

    return {
      gmName,
      year,
      name,
      position: posShortNames,
      teamName: teamShortName,
      type: "hitter",
      age: parseInt(ageObject.content),
      gamesPlayed: parseInt(gamesPlayedObject.content.replace(",", "")),
      plateAppearances,
      timesOnBase,
      runs: parseInt(runsObject.content.replace(",", "")),
      homeRuns: parseInt(homeRunsObject.content.replace(",", "")),
      rbi: parseInt(rbiObject.content.replace(",", "")),
      strikeouts: parseInt(strikeoutsObject.content.replace(",", "")),
      stolenBases: parseInt(stolenBasesObject.content.replace(",", "")),
      obp,
      ip: "--",
      ipNumber: "--",
      qualityStarts: "--",
      wins: "--",
      ks: "--",
      savesHolds: "--",
      era: "--",
      whip: "--",
      earnedRuns: "--",
      walksPlusHits: "--",
    };
  }
};

export const compileFootballStats = (row, gmName, year) => {
  const { scorer, cells } = row;
  const { name, posShortNames, teamShortName } = scorer;
  const positionsList = posShortNames.split(",");

  const [
    ageObject, // opponent
    ,
    fantasyPointsObject, // fantasyPointsPerGame // bye
    ,
    ,
    passingYardsObject,
    passingTDsObject,
    interceptionsObject,
    passing2PAObject,
    sacksObject,
    rushingYardsObject,
    rushingTDsObject,
    rushing2PAObject,
    rushing1DObject,
    receptionsObject,
    receivingYardsObject,
    receivingTDsObject,
    receiving2PAObject,
    receiving1DObject, // targets
    ,
    fumblesLostObject,
    fumbleRecoveryTDsObject,
    returnTDsObject,
    passing1DObject,
    gamesPlayedObject,
  ] = cells;

  const passingYdsString = passingYardsObject.content;
  const rushingYdsString = rushingYardsObject.content;
  const recievingYdsString = receivingYardsObject.content;
  const passing2PA = parseInt(passing2PAObject.content);
  const rushing2PA = parseInt(rushing2PAObject.content);
  const receiving2PA = parseInt(receiving2PAObject.content);
  const fumbleRecoveryTDs = parseInt(fumbleRecoveryTDsObject.content);
  const returnTDs = parseInt(returnTDsObject.content);

  return {
    gmName,
    year,
    name,
    position: positionsList.join(","),
    teamName: teamShortName,
    age: parseInt(ageObject.content),
    fantasyPoints: stringToFloatWithRounding(fantasyPointsObject.content, 1),
    passingYards: parseInt(passingYdsString.replace(",", "")),
    passingTDs: parseInt(passingTDsObject.content),
    interceptions: parseInt(interceptionsObject.content),
    sacks: parseInt(sacksObject.content),
    passing1D: parseInt(passing1DObject.content),
    passing2PA,
    rushingYards: parseInt(rushingYdsString.replace(",", "")),
    rushingTDs: parseInt(rushingTDsObject.content),
    rushing1D: parseInt(rushing1DObject.content),
    rushing2PA,
    receptions: parseInt(receptionsObject.content),
    receivingYards: parseInt(recievingYdsString.replace(",", "")),
    receivingTDs: parseInt(receivingTDsObject.content),
    receiving1D: parseInt(receiving1DObject.content),
    receiving2PA,
    fumblesLost: parseInt(fumblesLostObject.content),
    fumbleRecoveryTDs,
    returnTDs,
    total2PA: passing2PA + rushing2PA + receiving2PA,
    miscTDs: fumbleRecoveryTDs + returnTDs,
    gamesPlayed: parseInt(gamesPlayedObject.content),
  };
};

const inningsPitchedToNumberConverter = (inningsPitchedString) => {
  return inningsPitchedString.replace(".1", ".333").replace(".2", ".667");
};

const inningsPitchedToDisplayStringConverter = (inningsPitchedString) => {
  return inningsPitchedString.replace(".333", ".1").replace(".667", ".2");
};

export const totalPlayerStatsOverAllYears = (sport, allYearsStats) => {
  const allPlayersTotalStatsObject = {};
  // loop through each player and create their total stats object
  for (let i = 0; i < allYearsStats.length; i++) {
    let newPlayer = {};
    const player = allYearsStats[i];
    const { name, gmName } = player;

    // create unique key by which totals will be aggregated
    const uniqueKey = `${name}|${gmName}`;
    const playerAlreadyExists = Object.keys(
      allPlayersTotalStatsObject
    ).includes(uniqueKey);
    if (playerAlreadyExists) {
      const existingPlayer = allPlayersTotalStatsObject[uniqueKey];
      switch (sport) {
        case "basketball":
          newPlayer = totalExistingBasketballPlayerStats(
            existingPlayer,
            player
          );
          break;
        case "baseball":
          newPlayer = totalExistingBaseballPlayerStats(existingPlayer, player);
          break;
        // case "football":
        //   newPlayer =
        //     totalExistingFootballPlayerStats(existingPlayer, player);
        //     break;
        default:
          return;
      }
    } else {
      switch (sport) {
        case "basketball":
          newPlayer = totalNewBasketballPlayerStats(player);
          break;
        case "baseball":
          newPlayer = totalNewBaseballPlayerStats(player);
          break;
        // case "football":
        //   newPlayer = totalFootballPlayerStats(player);
        //   break;
        default:
          return;
      }
    }

    allPlayersTotalStatsObject[uniqueKey] = newPlayer;
  }

  // loop to clean up array fields and convert into array for upload to MongoDB
  const allPlayerStatsArray = [];
  for (const [, uniquePlayer] of Object.entries(allPlayersTotalStatsObject)) {
    // yearsArray -> year (ex: 2024-2025)
    const uniqueYearsArray = [...new Set(uniquePlayer.yearsArray)];
    uniqueYearsArray.sort();
    const year =
      uniqueYearsArray.length === 1
        ? uniqueYearsArray[0]
        : `${uniqueYearsArray[0]}-${
            uniqueYearsArray[uniqueYearsArray.length - 1]
          }`;

    // agesArray -> age (ex: 30-31)
    const uniqueAgesArray = [...new Set(uniquePlayer.agesArray)];
    uniqueAgesArray.sort();
    const age =
      uniqueAgesArray.length === 1
        ? uniqueAgesArray[0]
        : `${uniqueAgesArray[0]}-${
            uniqueAgesArray[uniqueAgesArray.length - 1]
          }`;

    // positions, comma separated
    const uniquePositionsArray = [...new Set(uniquePlayer.positionsArray)];
    const position = uniquePositionsArray.join(",");

    // teamnames, slash separated
    const uniqueTeamNamesArray = [...new Set(uniquePlayer.teamNamesArray)];
    const teamName = uniqueTeamNamesArray.join("/");

    delete uniquePlayer["yearsArray"];
    delete uniquePlayer["agesArray"];
    delete uniquePlayer["positionsArray"];
    delete uniquePlayer["teamNamesArray"];

    uniquePlayer["year"] = year;
    uniquePlayer["age"] = age;
    uniquePlayer["position"] = position;
    uniquePlayer["teamName"] = teamName;
    uniquePlayer["isTotalRecord"] = true;

    allPlayerStatsArray.push(uniquePlayer);
  }

  return allPlayerStatsArray;
};

const totalNewBasketballPlayerStats = (playerObject) => {
  const {
    name,
    gmName,
    year,
    age,
    position,
    gamesPlayed,
    points,
    rebounds,
    assists,
    threepm,
    steals,
    blocks,
    turnovers,
    teamName,
  } = playerObject;

  return {
    name,
    gmName,
    yearsArray: [year],
    agesArray: [age],
    positionsArray: position.split(","),
    gamesPlayed,
    points,
    rebounds,
    assists,
    fgPer: "--",
    ftPer: "--",
    threepm,
    steals,
    blocks,
    turnovers,
    teamNamesArray: teamName.split("/"),
  };
};

const totalExistingBasketballPlayerStats = (
  previousTotalPlayerObject,
  playerObject
) => {
  const {
    name: previousName,
    gmName: previousGmName,
    yearsArray,
    agesArray,
    positionsArray,
    gamesPlayed: previousGamesPlayed,
    points: previousPoints,
    rebounds: previousRebounds,
    assists: previousAssists,
    fgPer,
    ftPer,
    threepm: previousThreepm,
    steals: previousSteals,
    blocks: previousBlocks,
    turnovers: previousTurnovers,
    teamNamesArray,
  } = previousTotalPlayerObject;

  const {
    name,
    gmName,
    year,
    age,
    position,
    gamesPlayed,
    points,
    rebounds,
    assists,
    threepm,
    steals,
    blocks,
    turnovers,
    teamName,
  } = playerObject;

  // sanity check
  if (previousName !== name || previousGmName !== gmName) {
    console.error("Error! Mismatched players!!!!");
    console.log("Name: ", name, " / GM: ", gmName);
    console.log(
      "Previous Name: ",
      previousName,
      " / Previous GM: ",
      previousGmName
    );
  }

  yearsArray.push(year);
  agesArray.push(age);
  const newPositionsArray = [...positionsArray, ...position.split(",")];
  const newGamesPlayed = previousGamesPlayed + gamesPlayed;
  const newPoints = previousPoints + points;
  const newRebounds = previousRebounds + rebounds;
  const newAssists = previousAssists + assists;
  const newThreepm = previousThreepm + threepm;
  const newSteals = previousSteals + steals;
  const newBlocks = previousBlocks + blocks;
  const newTurnovers = previousTurnovers + turnovers;
  const newTeamNamesArray = [...teamNamesArray, ...teamName.split("/")];

  return {
    name,
    gmName,
    yearsArray,
    agesArray,
    positionsArray: newPositionsArray,
    gamesPlayed: newGamesPlayed,
    points: newPoints,
    rebounds: newRebounds,
    assists: newAssists,
    fgPer,
    ftPer,
    threepm: newThreepm,
    steals: newSteals,
    blocks: newBlocks,
    turnovers: newTurnovers,
    teamNamesArray: newTeamNamesArray,
  };
};

// todo Baseball and Football compilations
const totalNewBaseballPlayerStats = (playerObject) => {
  const { year, age, position, teamName } = playerObject;

  playerObject["yearsArray"] = [year];
  delete playerObject["year"];
  playerObject["agesArray"] = [age];
  delete playerObject["age"];
  playerObject["positionsArray"] = position.split(",");
  delete playerObject["position"];
  playerObject["teamNamesArray"] = teamName.split("/");
  delete playerObject["teamName"];

  return playerObject;
};

const totalExistingBaseballPlayerStats = (
  previousTotalPlayerObject,
  playerObject
) => {
  const {
    name: previousName,
    gmName: previousGmName,
    yearsArray,
    agesArray,
    positionsArray,
    gamesPlayed: previousGamesPlayed,
    plateAppearances: previousPlateAppearances,
    timesOnBase: previousTimesOnBase,
    runs: previousRuns,
    homeRuns: previousHomeRuns,
    rbi: previousRbi,
    strikeouts: previousStrikeouts,
    stolenBases: previousStolenBases,
    // obp: previousObp,
    // ip: previousIp,
    ipNumber: previousIpNumber,
    qualityStarts: previousQualityStarts,
    wins: previousWins,
    ks: previousKs,
    savesHolds: previousSavesHolds,
    // era: previousEra,
    // whip: previousWhip,
    earnedRuns: previousEarnedRuns,
    walksPlusHits: previousWalksPlusHits,
    teamNamesArray,
  } = previousTotalPlayerObject;

  let {
    name,
    gmName,
    year,
    age,
    position,
    gamesPlayed,
    plateAppearances,
    timesOnBase,
    runs,
    homeRuns,
    rbi,
    strikeouts,
    stolenBases,
    obp,
    ip,
    ipNumber,
    qualityStarts,
    wins,
    ks,
    savesHolds,
    era,
    whip,
    earnedRuns,
    walksPlusHits,
    teamName,
  } = playerObject;

  // sanity check
  if (previousName !== name || previousGmName !== gmName) {
    console.error("Error! Mismatched players!!!!");
    console.log("Name: ", name, " / GM: ", gmName);
    console.log(
      "Previous Name: ",
      previousName,
      " / Previous GM: ",
      previousGmName
    );
  }

  yearsArray.push(year);
  agesArray.push(age);
  const newPositionsArray = [...positionsArray, ...position.split(",")];
  const newTeamNamesArray = [...teamNamesArray, ...teamName.split("/")];
  const newGamesPlayed = previousGamesPlayed + gamesPlayed;

  // hitting stats
  if (isStatNotBlank(plateAppearances)) {
    plateAppearances += previousPlateAppearances;
  }
  if (isStatNotBlank(timesOnBase)) {
    timesOnBase += previousTimesOnBase;
  }
  if (isStatNotBlank(plateAppearances) && isStatNotBlank(timesOnBase)) {
    obp = stringToFloatWithRounding(timesOnBase / plateAppearances, 3);
  }
  if (isStatNotBlank(runs)) {
    runs += previousRuns;
  }
  if (isStatNotBlank(homeRuns)) {
    homeRuns += previousHomeRuns;
  }
  if (isStatNotBlank(rbi)) {
    rbi += previousRbi;
  }
  if (isStatNotBlank(strikeouts)) {
    strikeouts += previousStrikeouts;
  }
  if (isStatNotBlank(stolenBases)) {
    stolenBases += previousStolenBases;
  }

  // pitching stats
  if (isStatNotBlank(ipNumber)) {
    ipNumber += previousIpNumber;
    ip = inningsPitchedToDisplayStringConverter(ipNumber);
  }
  if (isStatNotBlank(qualityStarts)) {
    qualityStarts += previousQualityStarts;
  }
  if (isStatNotBlank(wins)) {
    wins += previousWins;
  }
  if (isStatNotBlank(ks)) {
    ks += previousKs;
  }
  if (isStatNotBlank(savesHolds)) {
    savesHolds += previousSavesHolds;
  }
  if (isStatNotBlank(earnedRuns)) {
    earnedRuns += previousEarnedRuns;
    era = stringToFloatWithRounding((earnedRuns / ipNumber) * 9, 2);
  }
  if (isStatNotBlank(walksPlusHits)) {
    walksPlusHits += previousWalksPlusHits;
    whip = stringToFloatWithRounding(walksPlusHits / ipNumber, 3);
  }

  return {
    name,
    gmName,
    yearsArray,
    agesArray,
    positionsArray: newPositionsArray,
    gamesPlayed: newGamesPlayed,
    plateAppearances,
    timesOnBase,
    runs,
    homeRuns,
    rbi,
    strikeouts,
    stolenBases,
    obp,
    ip,
    ipNumber,
    qualityStarts,
    wins,
    ks,
    savesHolds,
    era,
    whip,
    earnedRuns,
    walksPlusHits,
    teamNamesArray: newTeamNamesArray,
  };
};

const isStatNotBlank = (stat) => stat !== "--";
