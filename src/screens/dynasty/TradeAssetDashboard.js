import React, { useEffect, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { retrieveAssets } from "./TradeAssetHelper";

export const TradeAssetDashboard = () => {
  const { era, gmAbbreviation } = useParams();
  const [gmName, setGmName] = useState("");
  const [assets, setAssets] = useState({});
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { currentYear, inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ abbreviation: gmAbbreviation });
      const name = gmData?.[0]?.name ?? "";
      setGmName(name);

      const playerRosters = await retrieveAssets(
        gmData,
        inSeasonLeagues,
        leagueIdMappings
      );

      const { modifiedCount } = await gmCollection.updateOne(
        { abbreviation: gmAbbreviation },
        { $set: { assets: playerRosters } }
      );
      if (modifiedCount < 1) {
        console.log("Did not successfully update document");
      }

      setAssets(playerRosters);
    };

    if (isReady) {
      loadData();
    }
  }, [isReady]);

  return (
    <div>
      <h1>{`Trade Asset Dashboard for ${gmName}`}</h1>
      {Object.keys(assets).map((sport) => {
        const rosters = assets[sport];
        return (
          <div key={sport}>
            <h2>{capitalize(sport)}</h2>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {rosters.players.map((player) => {
                  return (
                    <div key={player}>
                      <p>{player}</p>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {rosters.draftPicks.map((draftPick) => {
                  return (
                    <div key={draftPick}>
                      <p>{draftPick}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
