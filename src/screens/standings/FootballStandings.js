import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";

import {
  addOwnerNames,
  calculateTop5Bottom5Standings,
  compileTrifectaStandings,
  h2hScrapeToStandings,
  returnOwnerNamesUnderscored,
  standingsScraper,
} from "./FootballStandingsHelpers";
import * as S from "styles/StandardScreen.styles";
import * as T from "styles/FootballStandings.styles";
import {
  TrifectaColumns,
  H2HColumns,
  Top5Bottom5Columns,
  FootballColumns,
} from "./FootballColumns";
import { Table } from "components/table/Table";
import { isYear1AfterYear2, isYear1BeforeYear2 } from "utils/years";
import { returnMongoCollection } from "database-management";
import { insertIntoArray } from "utils/arrays";
import { assignRankPoints } from "utils/standings";

export const FootballStandings = () => {
  const { year } = useParams();
  const { currentYear, isFootballStarted, isFootballInSeason } = useSelector(
    (state) => state?.currentVariables?.seasonVariables
  );
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const ownerNamesMapping = useSelector((state) => state?.names?.ownerNames);

  const [trifectaStandingsDisplay, setTrifectaStandings] = useState([]);
  const [h2hStandingsDisplay, setH2HStandings] = useState([]);
  const [top5Bottom5StandingsDisplay, setTop5Bottom5Standings] = useState([]);
  const [numberOfWeeks, setNumberOfWeeks] = useState(0);
  // only for pre-T5-B5 standings
  const [footballStandingsDisplay, setFootballStandings] = useState([]);

  useEffect(() => {
    if (isReady) {
      // send to local state to display
      const display = (
        trifectaStandings,
        h2hStandings,
        top5Bottom5Standings
      ) => {
        if (top5Bottom5Standings) {
          const weeksLength = Object.keys(top5Bottom5Standings?.[0]).filter(
            (key) => key.includes("week")
          ).length;
          setNumberOfWeeks(weeksLength);
        }
        setTrifectaStandings(trifectaStandings);
        setH2HStandings(h2hStandings);
        setTop5Bottom5Standings(top5Bottom5Standings);
      };

      // scrape, then display, then save to mongodb with new last scraped
      const scrape = async (collection) => {
        if (Object.keys(ownerNamesMapping).length > 0) {
          const ownerIdsCollection = await returnMongoCollection("ownerIds");
          const ownerIdsOwnerNames = await ownerIdsCollection.find({});
          const { h2hScrape } = await standingsScraper(year);
          const h2hStandingsWithoutNames = await h2hScrapeToStandings(
            h2hScrape
          );
          const h2hStandings = await addOwnerNames(
            ownerIdsOwnerNames,
            h2hStandingsWithoutNames
          );

          const top5Bottom5Collection = await returnMongoCollection(
            "footballTop5Bottom5Totals"
          );
          const top5Bottom5Data = await top5Bottom5Collection.find({ year });
          const ownerNamesUnderscoredObject = await returnOwnerNamesUnderscored(
            h2hStandings
          );
          const unrankedTop5Bottom5Standings =
            await calculateTop5Bottom5Standings(
              top5Bottom5Data[0]["top5Bottom5TotalsObject"],
              ownerNamesUnderscoredObject
            );
          const top5Bottom5Standings = await assignRankPoints(
            unrankedTop5Bottom5Standings,
            "winPer",
            "highToLow",
            "top5Bottom5TrifectaPoints",
            10,
            1
          );

          const trifectaStandings = await compileTrifectaStandings(
            h2hStandings,
            top5Bottom5Standings,
            ownerNamesMapping
          );

          display(trifectaStandings, h2hStandings, top5Bottom5Standings);

          // delete, then save to mongodb
          console.log("Delete, then save to mongodb");
          await collection.deleteMany({ year });
          await collection.insertOne({
            year,
            lastScraped: format(new Date(), "MM/dd/yy hh:mm a"),
            trifectaStandings,
            h2hStandings,
            top5Bottom5Standings,
          });
        }
      };

      // check if need to scrape or just display
      const check = async () => {
        const collection = await returnMongoCollection("footballStandings");
        const data = await collection.find({ year });
        const object = data[0] ?? {};
        const lastScrapedString = object?.lastScraped;
        const {
          trifectaStandings,
          h2hStandings,
          top5Bottom5Standings,
          footballStandings,
        } = object;

        // if not current year or not started or in season, then just display, do not scrape
        if (!isFootballStarted || !isFootballInSeason || year !== currentYear) {
          if (isYear1AfterYear2(year, currentYear)) {
            console.log("AHEAD of TIME!");
          } else {
            if (isYear1BeforeYear2(year, "2020")) {
              setFootballStandings(footballStandings);
            }
            display(trifectaStandings, h2hStandings, top5Bottom5Standings);
          }
          return;
        }

        // if there is no last scraped string (ie brand new, first time entering), scrape
        if (!lastScrapedString) {
          console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
          // return;
          scrape(collection);
        } else {
          const now = new Date();
          const alreadyScraped = isSameDay(now, new Date(lastScrapedString));

          // only scrape if not already scraped today
          if (!alreadyScraped) {
            console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
            // return;
            scrape(collection);
          } else {
            console.log("Already scraped");
            display(trifectaStandings, h2hStandings, top5Bottom5Standings);
          }
        }
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
  }, [isReady, ownerNamesMapping, year]);

  const TrifectaStandingsColumns = useMemo(() => {
    return isYear1BeforeYear2(year, currentYear) ||
      (isFootballStarted && !isFootballInSeason && year === currentYear)
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

  const TestColumns = useMemo(() => {
    const weekHeaders = [];
    for (let i = 1; i <= numberOfWeeks; i++) {
      weekHeaders.push({
        Header: `Week ${i}`,
        accessor: (data) => {
          const { points, win } = data[`week${i}`];
          return `${Number(points).toFixed(1)}###${win}`;
        },
        sortDescFirst: true,
      });
    }
    return insertIntoArray(Top5Bottom5Columns, 1, weekHeaders);
  }, [numberOfWeeks]);

  // only display
  if (isYear1BeforeYear2(year, "2020")) {
    return (
      <S.FlexColumnCenterContainer>
        <S.Title>{`${year} Football Standings`}</S.Title>
        <S.TablesContainer>
          <S.SingleTableContainer>
            <Table
              columns={FootballColumns}
              data={footballStandingsDisplay}
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
      <S.Title>{`${year} Football Standings`}</S.Title>
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
        <S.SingleTableContainer>
          <S.TableTitle>H2H Standings</S.TableTitle>
          <Table
            columns={H2HColumns}
            data={h2hStandingsDisplay}
            sortBy={[{ id: "h2hTrifectaPoints", desc: true }]}
            top3Styling
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Top 5 - Bottom 5 Standings</S.TableTitle>
          <Table
            columns={TestColumns}
            data={top5Bottom5StandingsDisplay}
            sortBy={[{ id: "top5Bottom5TrifectaPoints", desc: true }]}
            tableBodyCell={T.WeeksPointsTableBodyCell}
            top3Styling
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
