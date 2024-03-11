import { returnMongoCollection } from "database-management";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "components/button/Button";
import { Table } from "components/table/Table";

import { capitalize } from "lodash";
import { STATIC_ROUTES } from "Routes";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import * as S from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { playerStatsScraper } from "./PlayerStatsHelper";
import { ERA_1 } from "Constants";
import { BasketballStatsColumns } from "./StatsColumns";
import { PlayerStatsTable } from "./PlayerStatsTable";

export const SportPlayerStats = () => {
  const { era, sport } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    if (isReady) {
      const scrape = async () => {
        const globalVariablesCollection = await returnMongoCollection(
          "globalVariables"
        );
        const gmNamesIdsCollection = await returnMongoCollection(
          "gmNamesIds",
          ERA_1
        );
        const globalVariables = await globalVariablesCollection.find({});
        const dynastyGlobalVariables = globalVariables?.[0]?.dynasty;

        // get leagueId of inSeasonLeagues
        const { inSeasonLeagues, leagueIdMappings } = dynastyGlobalVariables;
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

          setPlayerStats(playerStats);
        }
      };
      scrape();
    }
  }, [isReady, era]);

  console.log("table", playerStats);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${capitalize(sport)} Player Stats`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableCaption>
            All stats are only recorded while in a starting lineup
          </S.TableCaption>
          <G.VerticalSpacer factor={4} />
          <PlayerStatsTable
            columns={BasketballStatsColumns}
            data={playerStats}
            sortBy={[{ id: "points", desc: true }]}
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
