import axios from "axios";

export const standingsScraper = async (leagueId) => {
  const data = await axios.post(
    `http://localhost:5000/standings`,
    {
      msgs: [{ method: "getStandings", data: { view: "ALL" } }],
      ng2: true,
      href: `https://www.fantrax.com/fantasy/league/${leagueId}/standings;view=ALL`,
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
  const tableStandings = data.data.responses[0].data.tableList.filter(
    (row) => row.caption === "Standings"
  );
  return tableStandings;
};

export const formatScrapedStandings = (standings, namesIdsObject, sport) => {
  const globalDivisionStandings = {};

  for (let i = 0; i < standings.length; i++) {
    const eachDivision = standings[i];
    const divisionName = eachDivision.subCaption;
    const eachDivisionStandings = [];

    for (let j = 0; j < eachDivision.rows.length; j++) {
      const eachTeam = eachDivision.rows[j];

      const gmName = namesIdsObject[eachTeam.fixedCells[1].teamId];
      const divStandingsObj = {
        teamName: eachTeam.fixedCells[1].content,
        gm: gmName ?? "N/A",
        wins: eachTeam.cells[0].content,
        losses: eachTeam.cells[1].content,
        ties: eachTeam.cells[2].content,
        winPer: eachTeam.cells[3].content,
        gamesBack: eachTeam.cells[5].content,
        divisionRecord: eachTeam.cells[4].content,
        division: divisionName,
      };
      if (sport === "football") {
        divStandingsObj["pointsFor"] = eachTeam.cells[7].content;
        divStandingsObj["pointsAgainst"] = eachTeam.cells[8].content;
      }
      eachDivisionStandings.push(divStandingsObj);
    }

    globalDivisionStandings[divisionName] = eachDivisionStandings;
  }
  return globalDivisionStandings;
};
