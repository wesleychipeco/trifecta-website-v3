import axios from "axios";
import round from "lodash/round";
import compact from "lodash/compact";

import { HIGH_TO_LOW } from "../../Constants";
import { assignRankPoints } from "../../utils/standings";

export const standingsScraper = async (year) => {
  const response = await axios.get(
    `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${year}/segments/0/leagues/154802?view=mTeam`
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
      pointsFor: round(team.record.overall.pointsFor, 1),
      pointsAgainst: round(team.record.overall.pointsAgainst, 1),
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

export const addOwnerNames = async (ownerIdsOwnerNamesArray, dataArray) => {
  // for each team in the standings
  dataArray.forEach((team) => {
    const teamOwnerIds = team.ownerIds;
    // pass into the function the array of ownerIds per team
    const ownerNames = returnOwnerNamesArray(
      ownerIdsOwnerNamesArray,
      teamOwnerIds
    );
    // join the returned array and add it to the team object and return the array
    team.ownerNames = ownerNames.join(", ");
  });
  return dataArray;
};

const returnOwnerNamesArray = (ownerIdsOwnerNamesArray, ownersPerTeam) => {
  const ownerNames = [];
  // for each ownerId per trifecta team
  ownersPerTeam.forEach((ownerId) => {
    // in the array of ownerId/ownerNames, find the object where the ownerIds are the same
    // and return the "ownerName" value from that object and add it to the array
    const ownerNameObject = ownerIdsOwnerNamesArray.find(
      (ownerIdsOwnerNames) => ownerIdsOwnerNames.ownerId === ownerId
    );
    if (ownerNameObject) {
      ownerNames.push(ownerNameObject.ownerName);
    }
  });

  // return the ownerNames array to be joined into string later
  return ownerNames;
};

export const returnOwnerNamesUnderscored = async (standingsWithOwnerNames) => {
  const ownerNamesUnderscored = [];
  standingsWithOwnerNames.forEach((team) => {
    const underscoredNames = team.ownerNames.replaceAll(" ", "_");
    const ownerTeamNameObject = {
      ownerNames: underscoredNames,
      teamName: team.teamName,
    };
    ownerNamesUnderscored.push(ownerTeamNameObject);
  });
  return ownerNamesUnderscored;
};

export const calculateTop5Bottom5Standings = async (
  top5Bottom5TotalObject,
  ownerNamesUnderscored
) => {
  // Total compiled standings array
  const top5Bottom5CompiledStandings = [];
  // Loop through each owner
  for (let i = 0; i < ownerNamesUnderscored.length; i++) {
    const teamOwnerObject = ownerNamesUnderscored[i];
    const { ownerNames, teamName } = teamOwnerObject;

    // Per owner object for display
    const top5Bottom5OwnerObject = {
      teamName: teamName,
    };

    // Per owner Top5Bottom5 totals array
    const ownerTop5Bottom5Array = top5Bottom5TotalObject[ownerNames];
    let wins = 0;
    let losses = 0;
    // Loop through each week
    for (let j = 0; j < ownerTop5Bottom5Array.length; j++) {
      const weekObject = ownerTop5Bottom5Array[j];

      if (weekObject.win) {
        wins++;
      } else {
        losses++;
      }
      const weekName = `week${j + 1}`;
      top5Bottom5OwnerObject[weekName] = weekObject;
    }

    // Add record string and winPer to object
    const winPer = round(wins / (wins + losses), 3);
    top5Bottom5OwnerObject.wins = wins;
    top5Bottom5OwnerObject.losses = losses;
    top5Bottom5OwnerObject.winPer = winPer;

    top5Bottom5CompiledStandings.push(top5Bottom5OwnerObject);
  }
  return top5Bottom5CompiledStandings;
};

export const compileTrifectaStandings = async (
  h2hStandings,
  top5Bottom5Standings,
  ownerNamesMapping
) => {
  const trifectaStandings = [];
  h2hStandings.forEach((team) => {
    const { teamName, h2hTrifectaPoints } = team;
    const ownerNames = compact(
      team.ownerIds.map((ownerId) => ownerNamesMapping[ownerId])
    ).join(", ");
    const { top5Bottom5TrifectaPoints } = top5Bottom5Standings.find(
      (top5Bottom5Team) => teamName === top5Bottom5Team.teamName
    );
    const totalTrifectaPoints = h2hTrifectaPoints + top5Bottom5TrifectaPoints;
    trifectaStandings.push({
      teamName,
      ownerNames,
      ownerIds: team.ownerIds,
      h2hTrifectaPoints,
      top5Bottom5TrifectaPoints,
      trifectaPoints: totalTrifectaPoints,
      playoffPoints: 0,
      totalTrifectaPoints,
    });
  });
  return trifectaStandings;
};
