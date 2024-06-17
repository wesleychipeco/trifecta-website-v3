import axios from "axios";
import { flatten } from "lodash";
import { extractBetweenParentheses } from "utils/strings";

export const playerStatsScraper = async (
  sport,
  leagueId,
  allTeamIdsMappings,
  year
) => {
  const url =
    process.env.REACT_APP_IS_LOCAL === "true"
      ? `http://localhost:5000/player-stats`
      : `https://www.trifectafantasyleague.com:443/player-stats`;

  const allTeamIds = Object.keys(allTeamIdsMappings);
  const finalPlayerStatsArray = [];
  for (let i = 0; i < allTeamIds.length; i++) {
    const teamId = allTeamIds[i];
    const fullGmName = allTeamIdsMappings[teamId];
    const gmName = extractBetweenParentheses(fullGmName);

    const data = await axios.post(
      url,
      {
        msgs: [
          {
            method: "getTeamRosterInfo",
            data: {
              leagueId: leagueId,
              statsType: "3",
              scoringCategoryType: "5",
              teamId: teamId,
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
      },
      {
        headers: {
          Accept: "application/json",
          LeagueId: leagueId,
        },
      }
    );

    const filteredPlayerStats =
      data.data.responses[0].data.tables[0].rows.filter((eachRow) => {
        const playerName = eachRow?.scorer?.name ?? "";
        return playerName.length > 0;
      });

    let finalFilteredPlayerStats = filteredPlayerStats;
    if (sport === "baseball") {
      const pitcherFilteredPlayerStats =
        data.data.responses[0].data.tables[1].rows.filter((eachRow) => {
          const playerName = eachRow?.scorer?.name ?? "";
          return playerName.length > 0;
        });

      finalFilteredPlayerStats = flatten([
        finalFilteredPlayerStats,
        pitcherFilteredPlayerStats,
      ]);
    }

    const trimmedPlayerStats = finalFilteredPlayerStats.map((eachRow) => {
      switch (sport) {
        case "basketball":
          return compileBasketballStats(eachRow, gmName, year);
        case "baseball":
          return compileBaseballStats(eachRow, gmName, year);
        default:
          return {};
      }
    });

    const playerStats = trimmedPlayerStats.filter((player) => player != null);
    finalPlayerStatsArray.push(playerStats);
  }

  return flatten(finalPlayerStatsArray);
};

const compileBasketballStats = (row, gmName, year) => {
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

const compileBaseballStats = (row, gmName, year) => {
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
      ageObject, // Games Started // IP
      ,
      ,
      qualityStartObject,
      winsObject, // HA // BBA
      ,
      ,
      ksObject,
      savesHoldsObject,
      eraObject,
      whipObject, // H // AB // R // RBI // HR // SO // OBP // SB
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
