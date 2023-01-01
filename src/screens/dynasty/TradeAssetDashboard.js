import React, { useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize, filter } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { rosterScraper } from "./TradeAssetHelper";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const TradeAssetDashboard = () => {
  const { era, gmLetter } = useParams();
  const [gmName, setGmName] = useState("");
  const [assets, setAssets] = useState({});
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { currentYear, inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  useEffect(() => {
    const doThis = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ letter: capitalize(gmLetter) });
      const name = gmData?.[0]?.name ?? "";
      setGmName(name);

      const inSeasonLeaguesSports = inSeasonLeagues.map((each) =>
        each.slice(0, each.length - 4)
      );
      console.log("insl", inSeasonLeaguesSports);
      const sportsRosters = {};

      for (let i = 0; i < SPORTS_ARRAY.length; i++) {
        const sport = SPORTS_ARRAY[i];
        const isSportInSeason = inSeasonLeaguesSports.includes(sport);
        console.log("in-season", sport, isSportInSeason);

        if (isSportInSeason) {
          // scrape
          const inSeasonSportArray = inSeasonLeagues.filter((isl) => {
            return isl.includes(sport);
          });
          const inSeasonSport = inSeasonSportArray[0];
          console.log("iss", inSeasonSport);
          const leagueId = leagueIdMappings[inSeasonSport];
          const teamId = gmData?.[0]?.mappings?.[inSeasonSport];
          const roster = await rosterScraper(leagueId, teamId);
          console.log("reste", roster);

          const formattedRoster = roster
            .filter((player) => player?.scorer !== undefined)
            .map((player) => {
              const name = player.scorer.name;
              const team =
                player.scorer?.teamShortName ?? player.scorer?.shortName;
              const positionsArray = player.scorer.posShortNames.split(",");
              const filteredPositionsArray = positionsArray.filter(
                (pos) => pos !== "G" && pos !== "F" && pos !== "Flx"
              );
              const playersArray = [
                name,
                filteredPositionsArray.join(", "),
                team,
              ];

              const minorLeagueAsterisk = player.scorer?.minorsEligible
                ? "*"
                : "";
              return `${playersArray.join(" - ")}${minorLeagueAsterisk}`;
            });

          console.log("form roster", formattedRoster);
          sportsRosters[sport] = formattedRoster;
        } else {
          // pull from DB
        }
        console.log("--------------------");
      }
      setAssets(sportsRosters);
    };

    if (isReady) {
      doThis();
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
            {rosters.map((player) => {
              return (
                <div key={player}>
                  <p>{player}</p>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
