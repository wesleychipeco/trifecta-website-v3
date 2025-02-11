import axios from "axios";
import { FANTRAX_URL_STRING } from "../NewConstants.js";

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
    gm: gmName,
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
      ageObject, // IP
      ,
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

    return {
      gmName,
      year,
      name,
      position: posShortNames,
      teamName: teamShortName,
      type: "pitcher",
      gm: gmName,
      age: parseInt(ageObject.content),
      gamesPlayed: parseInt(gamesPlayedObject.content.replace(",", "")),
      runs: "--",
      homeRuns: "--",
      rbi: "--",
      strikeouts: "--",
      stolenBases: "--",
      obp: "--",
      qualityStarts: parseInt(qualityStartObject.content.replace(",", "")),
      wins: parseInt(winsObject.content.replace(",", "")),
      ks: parseInt(ksObject.content.replace(",", "")),
      savesHolds: parseInt(savesHoldsObject.content.replace(",", "")),
      era: parseFloat(eraObject.content).toFixed(2),
      whip: parseFloat(whipObject.content).toFixed(2),
    };
  } else {
    // hitter
    const [
      ageObject, // AB // H
      ,
      ,
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

    return {
      gmName,
      year,
      name,
      position: posShortNames,
      teamName: teamShortName,
      type: "hitter",
      gm: gmName,
      age: parseInt(ageObject.content),
      gamesPlayed: parseInt(gamesPlayedObject.content.replace(",", "")),
      runs: parseInt(runsObject.content.replace(",", "")),
      homeRuns: parseInt(homeRunsObject.content.replace(",", "")),
      rbi: parseInt(rbiObject.content.replace(",", "")),
      strikeouts: parseInt(strikeoutsObject.content.replace(",", "")),
      stolenBases: parseInt(stolenBasesObject.content.replace(",", "")),
      obp: parseFloat(obpObject.content).toFixed(3),
      qualityStarts: "--",
      wins: "--",
      ks: "--",
      savesHolds: "--",
      era: "--",
      whip: "--",
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
    gm: gmName,
    age: parseInt(ageObject.content),
    fantasyPoints: parseFloat(fantasyPointsObject.content).toFixed(2),
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
