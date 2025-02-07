import axios from "axios";

const URL_STRING = "https://www.fantrax.com/fxpa/req?leagueId=";

export const scrapeStandings = async (leagueId) => {
  const backendUrl = `${URL_STRING}${leagueId}`;
  const body = {
    msgs: [{ method: "getStandings", data: { view: "ALL" } }],
    ng2: true,
    href: `https://www.fantrax.com/fantasy/league/${leagueId}/standings;view=ALL`,
    dt: 0,
    at: 0,
    av: null,
    tz: "America/Los_Angeles",
    v: "73.0.0",
  };

  return axios.post(backendUrl, body);
};

export const filterForStandings = async (tableList) => {
  return await tableList.reduce(async (prevPromise, v) => {
    let newArray = await prevPromise;
    if (v.caption === "Standings") newArray.push(v);
    return newArray;
  }, Promise.resolve([]));
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
        divStandingsObj["pointsFor"] = parseFloat(
          eachTeam.cells[6].content.replace(",", "")
        ).toFixed(2);
        divStandingsObj["pointsAgainst"] = parseFloat(
          eachTeam.cells[7].content.replace(",", "")
        ).toFixed(2);
      }
      eachDivisionStandings.push(divStandingsObj);
    }

    globalDivisionStandings[divisionName] = eachDivisionStandings;
  }
  return globalDivisionStandings;
};
