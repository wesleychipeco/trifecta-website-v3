import axios from "axios";
import { flatten } from "lodash";
import { numberToOrdinal } from "utils/strings";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const rosterScraper = async (leagueId, teamId) => {
  const data = await axios.post(
    `https://www.trifectafantasyleague.com:444/rosters`,
    // `http://localhost:5000/rosters`,
    {
      msgs: [
        {
          method: "getTeamRosterInfo",
          data: {
            leagueId,
            teamId,
          },
        },
      ],
      ng2: true,
      href: `https://www.fantrax.com/fantasy/league/${leagueId}/team/roster`,
      dt: 0,
      at: 0,
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

  const rawData = data.data.responses[0].data;
  const extracted = rawData.tables.map((table) => table.rows);
  const faab = rawData.miscData.transactionSalaryBudgetInfo[0].display;

  return {
    roster: flatten(extracted),
    faab: faab,
  };
};

export const retrieveAssets = async (
  gmData,
  inSeasonLeagues,
  leagueIdMappings
) => {
  const inSeasonLeaguesSports = inSeasonLeagues.map((each) =>
    each.slice(0, each.length - 4)
  );

  const sportsRosters = {};
  for (let i = 0; i < SPORTS_ARRAY.length; i++) {
    const sport = SPORTS_ARRAY[i];
    const isSportInSeason = inSeasonLeaguesSports.includes(sport);

    if (isSportInSeason) {
      // scrape rosters from fantrax
      const inSeasonSportArray = inSeasonLeagues.filter((isl) => {
        return isl.includes(sport);
      });
      const inSeasonSport = inSeasonSportArray[0];
      const leagueId = leagueIdMappings[inSeasonSport];
      const teamId = gmData?.[0]?.mappings?.[inSeasonSport];
      //console.log("league", leagueId, "team", teamId);
      const { roster, faab } = await rosterScraper(leagueId, teamId);
      //console.log("roster scraper", roster);

      const formattedPlayers = roster
        .filter((player) => player?.scorer !== undefined)
        .map((player) => {
          const name = player.scorer.name;
          const team = player.scorer?.teamShortName ?? player.scorer?.shortName;
          const positionsArray = player.scorer.posShortNames.split(",");
          const filteredPositionsArray = positionsArray.filter(
            (pos) => pos !== "G" && pos !== "F" && pos !== "Flx"
          );
          const playersArray = [name, filteredPositionsArray.join(", "), team];

          const minorLeagueAsterisk = player.scorer?.minorsEligible ? "*" : "";
          return `${playersArray.join(" - ")}${minorLeagueAsterisk}`;
        });

      sportsRosters[sport] = {
        players: formattedPlayers,
        faab,
      };
    } else {
      // if not in season, just use from db data
      const savedPlayers = gmData?.[0]?.assets?.[sport]?.players;
      const savedFaab = gmData?.[0]?.assets?.[sport]?.faab;
      sportsRosters[sport] = {
        players: savedPlayers,
        faab: savedFaab,
      };
    }

    let draftPicks = gmData?.[0]?.assets?.[sport]?.draftPicks ?? "need";
    if (draftPicks === "need") {
      draftPicks = await addDefaultDraftPicks(sport);
    }

    sportsRosters[sport]["draftPicks"] = draftPicks;
  }
  return sportsRosters;
};

const addDefaultDraftPicks = async (sport) => {
  let draftPicks;
  switch (sport) {
    case "basketball":
      draftPicks = 4;
      break;
    case "baseball":
      draftPicks = 7;
      break;
    case "football":
      draftPicks = 5;
      break;
    default:
      draftPicks = 0;
      break;
  }

  const defaultDraftPicks = [];
  const startingYear = 2024;
  for (let year = startingYear; year < startingYear + 5; year++) {
    for (let i = 1; i <= draftPicks; i++) {
      const draftPick = `${year} ${i}${numberToOrdinal(i)} Rd Pick`;
      defaultDraftPicks.push(draftPick);
    }
  }

  return defaultDraftPicks;
};
