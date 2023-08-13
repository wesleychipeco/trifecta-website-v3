import axios from "axios";
import round from "lodash/round";
import compact from "lodash/compact";

import { HIGH_TO_LOW, LOW_TO_HIGH } from "Constants";
import { assignRankPoints, assignRotoPoints } from "utils/standings";

export const standingsScraper = async (year) => {
  const response = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/flb/seasons/${year}/segments/0/leagues/109364?view=mTeam`
  );

  const h2hScrape = [];
  const rotoScrape = [];

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

    rotoScrape.push({
      teamName,
      ownerIds,
      R: team.valuesByStat["20"],
      HR: team.valuesByStat["5"],
      RBI: team.valuesByStat["21"],
      K: team.valuesByStat["27"],
      SB: team.valuesByStat["23"],
      OBP: round(team.valuesByStat["17"], 4),
      SO: team.valuesByStat["48"],
      QS: team.valuesByStat["63"],
      W: team.valuesByStat["53"],
      SV: team.valuesByStat["57"],
      ERA: round(team.valuesByStat["47"], 3),
      WHIP: round(team.valuesByStat["41"], 3),
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
