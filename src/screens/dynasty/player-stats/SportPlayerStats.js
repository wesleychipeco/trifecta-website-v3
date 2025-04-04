import { returnMongoCollection } from "database-management";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { capitalize, flatten } from "lodash";
import * as S from "styles/StandardScreen.styles";
import * as T from "styles/PlayerStats.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";

import {
  BasketballStatsColumns,
  BaseballStatsColumns,
  FootballStatsColumns,
} from "./StatsColumns";
import { PlayerStatsTable } from "./PlayerStatsTable";
import { BASEBALL, BASKETBALL, FOOTBALL } from "Constants";

export const SportPlayerStats = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const { era, sport } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [playerStats, setPlayerStats] = useState([]);
  const [gmsArray, setGmsArray] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [yearsArray, setYearsArray] = useState([]);
  const [lastScrapedDay, setLastScrapedDay] = useState("");

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
      case BASKETBALL:
        return BasketballStatsColumns;
      case BASEBALL:
        return BaseballStatsColumns;
      case FOOTBALL:
        return FootballStatsColumns;
      default:
        return BasketballStatsColumns;
    }
  }, [sport]);

  useEffect(() => {
    if (isReady) {
      const display = async () => {
        await getAndSetGmsArray();

        let lastScrapedDate = "";
        const statsCollection = await returnMongoCollection("playerStats", era);
        const data = await statsCollection.find({ sport });

        const allStats = [];
        const allYears = ["all"];
        for (let i = 0; i < data.length; i++) {
          const eachYearObject = data[i];
          const { year, playerStats, lastScraped } = eachYearObject;
          allYears.push(year);
          allStats.push(playerStats);
          lastScrapedDate = lastScraped;
        }
        const flattenAllStats = flatten(allStats);

        setYearsArray(allYears);
        setPlayerStats(flattenAllStats);
        setIsLoading(false);
        console.log(
          `${sport} Player Stats last scraped (Local time): ${lastScrapedDate}`
        );
        if (lastScrapedDate) {
          const lastScrapedIndex = lastScrapedDate.indexOf(",");
          const lastScrapedDay = lastScrapedDate.substring(0, lastScrapedIndex);
          setLastScrapedDay(lastScrapedDay);
        }
      };

      display();
    }
  }, [isReady, era, sport, getAndSetGmsArray]);

  // console.log("ps", playerStats);
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${capitalize(sport)} Player Stats`}</S.Title>
      <T.TablesContainer>
        <S.SingleTableContainer>
          <G.FlexRowStart>
            <S.TableCaption>
              All stats are only recorded while in a starting fantasy lineup.
            </S.TableCaption>
            {lastScrapedDay && (
              <>
                <G.HorizontalSpacer factor={1} />
                <S.LastUpdatedTime style={{ fontWeight: 800 }}>
                  Last Updated:{" "}
                </S.LastUpdatedTime>
                <G.HorizontalSpacer factor={1} />
                <S.LastUpdatedTime>{lastScrapedDay}</S.LastUpdatedTime>
              </>
            )}
          </G.FlexRowStart>
          <G.VerticalSpacer factor={isMobile ? 0 : 4} />
          <PlayerStatsTable
            sport={sport}
            columns={statsColumns}
            data={playerStats}
            gmsArray={gmsArray}
            isMobile={isMobile}
            isLoading={isLoading}
            yearsArray={yearsArray}
          />
        </S.SingleTableContainer>
      </T.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
