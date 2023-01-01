import axios from "axios";
import { flatten } from "lodash";

export const rosterScraper = async (leagueId, teamId) => {
  console.log("leagueId", leagueId);
  console.log("teamid", teamId);
  const data = await axios.post(
    `http://localhost:5000/rosters`,
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
  console.log("ddd", data.data.responses[0].data.tables);
  const extracted = data.data.responses[0].data.tables.map(
    (table) => table.rows
  );
  return flatten(extracted);
};
