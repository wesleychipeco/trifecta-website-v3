import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import { startCase } from "lodash";
import axios from "axios";

export const DynastyStandings = () => {
  const { era, year } = useParams();
  console.log("era", era, "year", year);

  useEffect(() => {
    const scrape = async () => {
      const data = await axios.post(
        `http://localhost:5000/basketball-standings`,
        {
          msgs: [{ method: "getStandings", data: { view: "ALL" } }],
          ng2: true,
          href: "https://www.fantrax.com/fantasy/league/aznbe7wvl8esmlyo/standings;view=ALL",
          dt: 0,
          at: 0,
          av: null,
          tz: "America/Los_Angeles",
          v: "73.0.0",
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
      const tableStandings = data.data.responses[0].data.tableList.filter(
        (row) => row.caption === "Standings"
      );
      console.log("DATA HERE!!!!", tableStandings);
    };

    scrape();
  }, []);

  return (
    <div>
      <h1>This is the template dynasty standings page</h1>
    </div>
  );
};
