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
      : `https://www.trifectafantasyleague.com:444/player-stats`;

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
              leagueId: "qetmklwvlme56vez",
              statsType: "3",
              scoringCategoryType: "5",
              teamId: teamId,
            },
          },
        ],
        ng2: true,
        refUrl:
          "https://www.fantrax.com/fantasy/league/qetmklwvlme56vez/team/roster;statsType=3;scoringCategoryType=5?pendingTransactions=false",
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

    const trimmedPlayerStats = filteredPlayerStats.map((eachRow) => {
      switch (sport) {
        case "basketball":
          const PRIMARY_POSITIONS = ["PG", "SG", "SF", "PF", "C"];
          const { scorer, cells } = eachRow;
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

          if (
            gamesPlayedObject.content === "" ||
            gamesPlayedObject.content === "0"
          ) {
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
            fgPer: parseFloat(fgPerObject.content),
            ftPer: parseFloat(ftPerObject.content),
            threepm: parseInt(threepmObject.content.replace(",", "")),
            points: parseInt(pointsObject.content.replace(",", "")),
            rebounds: parseInt(reboundsObject.content.replace(",", "")),
            assists: parseInt(assistsObject.content.replace(",", "")),
            steals: parseInt(stealsObject.content.replace(",", "")),
            blocks: parseInt(blocksObject.content.replace(",", "")),
            turnovers: parseInt(turnoversObject.content.replace(",", "")),
          };

        default:
          return {};
      }
    });

    const playerStats = trimmedPlayerStats.filter((player) => player != null);
    finalPlayerStatsArray.push(playerStats);
  }

  return flatten(finalPlayerStatsArray);
};
