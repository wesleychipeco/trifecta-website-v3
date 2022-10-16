import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import isSameDay from "date-fns/isSameDay";

import { Table } from "../../components/table/Table";
import {
  compileTrifectaStandings,
  h2hScrapeToStandings,
  rotoScrapeToStandings,
  standingsScraper,
} from "./helpers";
import * as S from "./BasketballStandings.styles";
import {
  TrifectaColumns,
  H2HColumns,
  RotoColumns,
  RotoStatsColumns,
  BasketballColumns,
} from "./columns";
import { isYear1AfterYear2, isYear1BeforeYear2 } from "../../utils/years";
import { returnMongoCollection } from "../../database-management";
import { insertIntoArray } from "../../utils/arrays";

export const BasketballStandings = () => {
  const { year } = useParams();
  const { currentYear, isBasketballStarted, isBasketballInSeason } =
    useSelector((state) => state?.currentVariables?.seasonVariables);
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const ownerNamesMapping = useSelector((state) => state?.names?.ownerNames);

  const [trifectaStandingsDisplay, setTrifectaStandings] = useState([]);
  const [h2hStandingsDisplay, setH2HStandings] = useState([]);
  const [rotoStandingsDisplay, setRotoStandings] = useState([]);
  // only for pre-roto standings
  const [basketballStandingsDisplay, setBasketballStandings] = useState([]);

  useEffect(() => {
    if (isReady) {
      // send to local state to display
      const display = (trifectaStandings, h2hStandings, rotoStandings) => {
        setTrifectaStandings(trifectaStandings);
        setH2HStandings(h2hStandings);
        setRotoStandings(rotoStandings);
      };

      // scrape, then display, then save to mongodb with new last scraped
      const scrape = async (collection) => {
        if (Object.keys(ownerNamesMapping).length > 0) {
          const { h2hScrape, rotoScrape } = await standingsScraper(year);

          const h2hStandings = await h2hScrapeToStandings(h2hScrape);
          const rotoStandings = await rotoScrapeToStandings(rotoScrape);
          const trifectaStandings = await compileTrifectaStandings(
            h2hStandings,
            rotoStandings,
            ownerNamesMapping
          );

          display(trifectaStandings, h2hStandings, rotoStandings);

          // delete, then save to mongodb
          console.log("Delete, then save to mongodb");
          await collection.deleteMany({ year });
          await collection.insertOne({
            year,
            lastScraped: new Date().toISOString(),
            trifectaStandings,
            h2hStandings,
            rotoStandings,
          });
        }
      };

      // check if need to scrape or just display
      const check = async () => {
        const collection = await returnMongoCollection("basketballStandings");
        const data = await collection.find({ year });
        const object = data[0] ?? {};
        const lastScrapedString = object?.lastScraped;
        const { trifectaStandings, h2hStandings, rotoStandings } = object;

        // if not current year or not started or in season, then just display, do not scrape
        if (
          !isBasketballStarted ||
          !isBasketballInSeason ||
          year !== currentYear
        ) {
          if (isYear1AfterYear2(year, currentYear)) {
            console.log("AHEAD of TIME!");
          } else {
            if (isYear1BeforeYear2(year, "2020")) {
              setBasketballStandings(object.basketballStandings);
            }
            display(trifectaStandings, h2hStandings, rotoStandings);
          }
          return;
        }

        // if there is no last scraped string (ie brand new, first time entering), scrape
        if (!lastScrapedString) {
          console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
          return;
          scrape(collection);
        } else {
          const now = new Date();
          const alreadyScraped = isSameDay(now, new Date(lastScrapedString));

          // only scrape if not already scraped today
          if (!alreadyScraped) {
            console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
            return;
            scrape(collection);
          } else {
            display(trifectaStandings, h2hStandings, rotoStandings);
          }
        }
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
  }, [isReady, ownerNamesMapping]);

  const TrifectaStandingsColumns = useMemo(() => {
    return isYear1BeforeYear2(year, currentYear) ||
      (isBasketballStarted && !isBasketballInSeason && year === currentYear)
      ? insertIntoArray(TrifectaColumns, 4, [
          {
            Header: "Regular Season Trifecta Points",
            accessor: "trifectaPoints",
            tableHeaderCell: S.NumbersTableHeaderCell,
            sortDescFirst: true,
          },
          {
            Header: "Playoff Points",
            accessor: "playoffPoints",
            tableHeaderCell: S.NumbersTableHeaderCell,
            sortDescFirst: true,
          },
        ])
      : TrifectaColumns;
  }, [isReady]);

  // only display
  if (isYear1BeforeYear2(year, "2020")) {
    return (
      <S.FlexColumnCenterContainer>
        <S.Title>{`${year} Basketball Standings`}</S.Title>
        <S.TablesContainer>
          <S.SingleTableContainer>
            <Table
              columns={BasketballColumns}
              data={basketballStandingsDisplay}
              sortBy={[{ id: "totalTrifectaPoints", desc: true }]}
              top3Styling
            />
          </S.SingleTableContainer>
        </S.TablesContainer>
      </S.FlexColumnCenterContainer>
    );
  }

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Basketball Standings`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Trifecta Standings</S.TableTitle>
          <Table
            columns={TrifectaStandingsColumns}
            data={trifectaStandingsDisplay}
            sortBy={[{ id: "totalTrifectaPoints", desc: true }]}
            top3Styling
          />
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          <S.LeftTableContainer>
            <S.TableTitle>H2H Standings</S.TableTitle>
            <Table
              columns={H2HColumns}
              data={h2hStandingsDisplay}
              sortBy={[{ id: "h2hTrifectaPoints", desc: true }]}
              top3Styling
            />
          </S.LeftTableContainer>
          <div>
            <S.TableTitle>Roto Standings</S.TableTitle>
            <Table
              columns={RotoColumns}
              data={rotoStandingsDisplay}
              sortBy={[{ id: "rotoTrifectaPoints", desc: true }]}
              top3Styling
            />
          </div>
        </S.TwoTablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Roto Stats</S.TableTitle>
          <Table
            columns={RotoStatsColumns}
            data={rotoStandingsDisplay}
            top3Styling
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
