import axios from "axios";
import round from "lodash/round";
import compact from "lodash/compact";

import { HIGH_TO_LOW, LOW_TO_HIGH } from "../../Constants";
import { assignRankPoints, assignRotoPoints } from "../../utils/standings";

export const standingsScraper = async (year) => {
  const response = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/flb/seasons/${year}/segments/0/leagues/109364?view=mTeam`
  );

  const h2hScrape = [];

  const teams = response?.data?.teams ?? [];
  teams.forEach((team) => {
    const teamName = `${team.location} ${team.nickname}`;
    const ownerIds = team.owners;

    h2hScrape.push({
      teamName,
      ownerIds,
      wins: team.record.overall.wins,
      losses: team.record.overall.losses,
      ties: team.record.overall.ties,
      winPer: round(team.record.overall.percentage, 3),
    });
  });

  return {
    h2hScrape,
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
    { category: "R", sortDirection: HIGH_TO_LOW },
    { category: "HR", sortDirection: HIGH_TO_LOW },
    { category: "RBI", sortDirection: HIGH_TO_LOW },
    { category: "K", sortDirection: LOW_TO_HIGH },
    { category: "SB", sortDirection: HIGH_TO_LOW },
    { category: "OBP", sortDirection: HIGH_TO_LOW },
    { category: "SO", sortDirection: HIGH_TO_LOW },
    { category: "QS", sortDirection: HIGH_TO_LOW },
    { category: "W", sortDirection: HIGH_TO_LOW },
    { category: "SV", sortDirection: HIGH_TO_LOW },
    { category: "ERA", sortDirection: LOW_TO_HIGH },
    { category: "WHIP", sortDirection: LOW_TO_HIGH },
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
