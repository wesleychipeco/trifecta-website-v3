import { returnMongoCollection } from "database-management";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { capitalize } from "lodash";
import * as S from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";

import { playerStatsScraper } from "./PlayerStatsHelper";
import { BasketballStatsColumns, BaseballStatsColumns } from "./StatsColumns";
import { PlayerStatsTable } from "./PlayerStatsTable";
import { isSameDay } from "date-fns";

export const SportPlayerStats = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const { era, sport } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const [playerStats, setPlayerStats] = useState([]);
  const [gmsArray, setGmsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAndSetGmsArray = useCallback(async () => {
    // get list of gm abbreviations
    const gmCollection = await returnMongoCollection("gms", era);
    const gmData = await gmCollection.find(
      {},
      { projection: { abbreviation: 1, name: 1 } }
    );
    const gmNamesArray = gmData.map((gm) => `${gm.name} (${gm.abbreviation})`);
    setGmsArray(gmNamesArray);
  }, [setGmsArray, era]);

  const statsColumns = useMemo(() => {
    switch (sport) {
      case "basketball":
        return BasketballStatsColumns;
      case "baseball":
        return BaseballStatsColumns;
      case "football":
      default:
        return BasketballStatsColumns;
    }
  }, [isReady, era, sport]);

  useEffect(() => {
    if (isReady) {
      const check = async () => {
        await getAndSetGmsArray();
        const statsCollection = await returnMongoCollection("playerStats", era);
        const data = await statsCollection.find({ sport });
        const object = data?.[0] ?? {};
        const { lastScraped: lastScrapedString, playerStats } = object;
        const inSeasonThisSportLeagues = inSeasonLeagues.filter((season) =>
          season.includes(sport)
        );
        const isThisSportInSeason = inSeasonThisSportLeagues.length > 0;

        if (!lastScrapedString && isThisSportInSeason) {
          scrape();
        } else {
          const alreadyScraped = isSameDay(
            new Date(),
            new Date(lastScrapedString)
          );

          if (alreadyScraped || !isThisSportInSeason) {
            setPlayerStats(playerStats);
            setIsLoading(false);
          } else {
            scrape();
          }
        }
      };

      const scrape = async () => {
        const gmNamesIdsCollection = await returnMongoCollection(
          "gmNamesIds",
          era
        );

        // get leagueId of inSeasonLeagues
        const inSeasonLeaguesBySelectedSport = inSeasonLeagues.filter(
          (season) => season.includes(sport)
        );

        for (let i = 0; i < inSeasonLeaguesBySelectedSport.length; i++) {
          const seasonToScrape = inSeasonLeaguesBySelectedSport[i];
          const year = seasonToScrape.slice(-4);
          const leagueIdToScrape = leagueIdMappings[seasonToScrape];
          // get all teamIds in league
          const allTeamIdsData = await gmNamesIdsCollection.find({
            leagueId: leagueIdToScrape,
          });
          const allTeamIdsMappings = allTeamIdsData?.[0]?.mappings ?? [];
          const playerStats = await playerStatsScraper(
            sport,
            leagueIdToScrape,
            allTeamIdsMappings,
            year
          );
          // console.log("player stats", playerStats);

          setPlayerStats(playerStats);
          setIsLoading(false);

          console.log("Delete, then save to mongodb");
          const statsCollection = await returnMongoCollection(
            "playerStats",
            era
          );
          await statsCollection.deleteOne({ sport });
          await statsCollection.insertOne({
            sport,
            lastScraped: new Date().toISOString(),
            playerStats,
          });

          // TODO - multiple years of stats
          // When GET, retrieve previous stats in DB add remove current year, then add in freshly scraped
          // Toggle to sum all unique player-GM combos (need new function)
          // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript
          /*
          const data = [
            { group: 'A', name: 'SD' }, 
            { group: 'B', name: 'FI' }, 
            { group: 'A', name: 'MM' },
            { group: 'B', name: 'CO'}
          ];
          const unique = [...new Set(data.map(item => item.group))]; // [ 'A', 'B']
          */
        }
      };

      check();
    }
  }, [isReady, era, sport]);

  // console.log("ps", playerStats);
  // TODO - make "BasketballStatsColumns" and sortBy "gamesPlayed" conditional by sport
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${capitalize(sport)} Player Stats`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableCaption>
            All stats are only recorded while in a starting lineup
          </S.TableCaption>
          <G.VerticalSpacer factor={isMobile ? 0 : 4} />
          <PlayerStatsTable
            sport={sport}
            columns={statsColumns}
            data={playerStats}
            sortBy={[{ id: "gamesPlayed", desc: true }]}
            gmsArray={gmsArray}
            isMobile={isMobile}
            isLoading={isLoading}
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
