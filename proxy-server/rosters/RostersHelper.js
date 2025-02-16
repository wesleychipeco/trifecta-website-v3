import axios from "axios";
import {
  BASEBALL,
  BASEBALL_DRAFT_PICK_NUMBER,
  BASKETBALL,
  BASKETBALL_DRAFT_PICK_NUMBER,
  FANTRAX_URL_STRING,
  FOOTBALL,
  FOOTBALL_DRAFT_PICK_NUMBER,
} from "../APIConstants.js";
import flatten from "lodash/flatten.js";

export const scrapeRosters = async (leagueId, teamId) => {
  const backendUrl = `${FANTRAX_URL_STRING}${leagueId}`;
  const body = {
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
  };

  const data = await axios.post(backendUrl, body);
  return data.data.responses[0].data;
};

export const formatPlayers = (rawData) => {
  const rawRoster = rawData.tables.map((table) => table.rows);
  const roster = flatten(rawRoster);
  const formattedPlayers = roster
    .filter(
      (player) =>
        player?.scorer !== undefined && player?.scorerColumn !== "Totals"
    )
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
  return formattedPlayers;
};

export const retrieveFaab = (rawData) => {
  return rawData.miscData.transactionSalaryBudgetInfo[0].display;
};

export const addDefaultDraftPicks = (sport) => {
  let draftPicks;
  switch (sport) {
    case BASKETBALL:
      draftPicks = BASKETBALL_DRAFT_PICK_NUMBER;
      break;
    case BASEBALL:
      draftPicks = BASEBALL_DRAFT_PICK_NUMBER;
      break;
    case FOOTBALL:
      draftPicks = FOOTBALL_DRAFT_PICK_NUMBER;
      break;
    default:
      draftPicks = 0;
      break;
  }

  const defaultDraftPicks = [];
  const startingYear = STARTING_YEAR_SUPPLEMENTAL_DRAFT_PICKS;
  for (let year = startingYear; year < startingYear + 4; year++) {
    for (let i = 1; i <= draftPicks; i++) {
      const draftPick = `${year} ${i}${numberToOrdinal(i)} Rd Pick`;
      defaultDraftPicks.push(draftPick);
    }
  }

  return defaultDraftPicks;
};
