import axios from "axios";
import round from "lodash/round";
import compact from "lodash/compact";

import { HIGH_TO_LOW, LOW_TO_HIGH } from "Constants";
import { assignRankPoints, assignRotoPoints } from "utils/standings";

export const standingsScraper = async (year) => {
  const response = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/fba/seasons/${year}/segments/0/leagues/100660?view=mTeam`
  );

  const h2hScrape = [];
  const rotoScrape = [];

  const teams = response?.data?.teams ?? [];
  teams.forEach((team) => {
    const teamName = team.name;
    const ownerIds = team.owners;

    h2hScrape.push({
      teamName,
      ownerIds,
      wins: team.record.overall.wins,
      losses: team.record.overall.losses,
      ties: team.record.overall.ties,
      winPer: round(team.record.overall.percentage, 3),
    });

    rotoScrape.push({
      teamName,
      ownerIds,
      FGPER: round(team.valuesByStat["19"], 4),
      FTPER: round(team.valuesByStat["20"], 4),
      THREEPM: team.valuesByStat["17"],
      REB: team.valuesByStat["6"],
      AST: team.valuesByStat["3"],
      STL: team.valuesByStat["2"],
      BLK: team.valuesByStat["1"],
      TO: team.valuesByStat["11"],
      PTS: team.valuesByStat["0"],
    });
  });

  return {
    h2hScrape,
    rotoScrape,
  };
};

export const h2hScrapeToStandings = async (scrape) => {
  return assignRankPoints(
    scrape,
    "winPer",
    HIGH_TO_LOW,
    "h2hTrifectaPoints",
    10,
    1
  );
};

export const rotoScrapeToStandings = async (scrape) => {
  const rotoCategoriesArray = [
    { category: "FGPER", sortDirection: HIGH_TO_LOW },
    { category: "FTPER", sortDirection: HIGH_TO_LOW },
    { category: "THREEPM", sortDirection: HIGH_TO_LOW },
    { category: "REB", sortDirection: HIGH_TO_LOW },
    { category: "AST", sortDirection: HIGH_TO_LOW },
    { category: "STL", sortDirection: HIGH_TO_LOW },
    { category: "BLK", sortDirection: HIGH_TO_LOW },
    { category: "TO", sortDirection: LOW_TO_HIGH },
    { category: "PTS", sortDirection: HIGH_TO_LOW },
  ];
  const withRotoPoints = assignRotoPoints(scrape, rotoCategoriesArray);
  return assignRankPoints(
    withRotoPoints,
    "totalPoints",
    HIGH_TO_LOW,
    "rotoTrifectaPoints",
    10,
    1
  );
};

export const compileTrifectaStandings = async (
  h2hStandings,
  rotoStandings,
  ownerNamesMapping
) => {
  const trifectaStandings = [];
  h2hStandings.forEach((team) => {
    const { teamName, h2hTrifectaPoints } = team;
    const ownerNames = compact(
      team.ownerIds.map((ownerId) => ownerNamesMapping[ownerId])
    ).join(", ");
    const { rotoTrifectaPoints } = rotoStandings.find(
      (rotoTeam) => teamName === rotoTeam.teamName
    );
    const totalTrifectaPoints = h2hTrifectaPoints + rotoTrifectaPoints;
    trifectaStandings.push({
      teamName,
      ownerIds: team.ownerIds,
      ownerNames,
      h2hTrifectaPoints,
      rotoTrifectaPoints,
      trifectaPoints: totalTrifectaPoints,
      playoffPoints: 0,
      totalTrifectaPoints,
    });
  });
  return trifectaStandings;
};
