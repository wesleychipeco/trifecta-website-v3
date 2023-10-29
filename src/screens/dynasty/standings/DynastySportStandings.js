import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import isSameDay from "date-fns/isSameDay";
import { capitalize, sortBy } from "lodash";
import { returnMongoCollection } from "database-management";
import * as S from "styles/StandardScreen.styles";
import { Table } from "components/table/Table";
import { standingsScraper, formatScrapedStandings } from "./StandingsHelper";
import { DynastyStandingsColumnsRaw } from "./StandingsColumns";
import { assignRankPoints } from "utils/standings";
import { ERA_1, HIGH_TO_LOW, NUMBER_OF_TEAMS } from "Constants";
import { useSelector } from "react-redux";
import { calculateWinPer } from "utils/winPer";
import { addKeyValueToEachObjectInArray, insertIntoArray } from "utils/arrays";
import { PlayoffColumns } from "./StandingsColumns";

const DIVISION_ORDER_ARRAY = ["North", "South", "East", "West"];

export const DynastySportStandings = ({ sport }) => {
  const { era, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { currentYear, inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  const [dynastyStandings, setDynastyStandings] = useState([]);
  const [divisionStandings, setDivisionStandings] = useState({
    North: [],
    South: [],
    East: [],
    West: [],
  });

  useEffect(() => {
    if (isReady) {
      const sportYear = `${sport}${year}`;
      const display = async (dynastyStandings, divisionStandings) => {
        setDynastyStandings(dynastyStandings);
        setDivisionStandings(divisionStandings);
      };

      const scrape = async (collection) => {
        const leagueId = leagueIdMappings[sportYear];
        const gmNamesIdsCollection = await returnMongoCollection(
          "gmNamesIds",
          ERA_1
        );
        const gmNamesIds = await gmNamesIdsCollection.find({ leagueId });
        const gmNamesIdsMapping = gmNamesIds?.[0]?.mappings ?? {};
        const tableStandings = await standingsScraper(leagueId);
        const divisionStandings = formatScrapedStandings(
          tableStandings,
          gmNamesIdsMapping,
          sport
        );
        const dynastyStandingsNoPlayoffs = assignRankPoints(
          Object.values(divisionStandings).flat(1),
          "winPer",
          HIGH_TO_LOW,
          "totalDynastyPoints",
          NUMBER_OF_TEAMS,
          1
        );

        const dynastyStandings = addKeyValueToEachObjectInArray(
          dynastyStandingsNoPlayoffs,
          { dynastyPoints: "totalDynastyPoints" },
          { playoffPoints: 0 }
        );

        display(dynastyStandings, divisionStandings);

        // delete, then save to mongodb
        console.log("Delete, then save to mongodb");
        await collection.deleteMany({ year });
        await collection.insertOne({
          year,
          lastScraped: new Date().toISOString(),
          dynastyStandings,
          divisionStandings,
        });
      };

      const check = async () => {
        const collection = await returnMongoCollection(
          `${sport}Standings`,
          era
        );
        const data = await collection.find({ year });
        const object = data?.[0] ?? {};
        const {
          lastScraped: lastScrapedString,
          dynastyStandings,
          divisionStandings,
        } = object;

        // ADD logic if sport+year is NOT in "inSeasonLeagues", then just display and return out
        if (!inSeasonLeagues.includes(sportYear)) {
          display(dynastyStandings, divisionStandings);
          return;
        }

        // if no last scraped string, always scrape
        if (!lastScrapedString) {
          scrape(collection);
        } else {
          // if alreadyd scraped today, just display
          const alreadyScraped = isSameDay(
            new Date(),
            new Date(lastScrapedString)
          );
          if (alreadyScraped) {
            display(dynastyStandings, divisionStandings);
          } else {
            scrape(collection);
          }
        }
      };

      check();
    }
  }, [isReady, sport, year]);

  const divisionRecordSorter = useCallback((rowA, rowB) => {
    const divRecordA = rowA?.values?.divisionRecord ?? "";
    const divRecordB = rowB?.values?.divisionRecord ?? "";
    const divRecordAArray = divRecordA.split("-");
    const divRecordBArray = divRecordB.split("-");

    if (divRecordAArray.length === 3 && divRecordBArray.length === 3) {
      const [winsA, lossesA, tiesA] = divRecordAArray;
      const [winsB, lossesB, tiesB] = divRecordBArray;

      const winPerA = calculateWinPer({
        wins: Number(winsA),
        losses: Number(lossesA),
        ties: Number(tiesA),
      });
      const winPerB = calculateWinPer({
        wins: Number(winsB),
        losses: Number(lossesB),
        ties: Number(tiesB),
      });

      if (winPerA > winPerB) return 1;
      if (winPerA < winPerB) return -1;
    }

    return 0;
  }, []);

  const DynastyStandingsColumns = useMemo(() => {
    if (!isReady) {
      return [];
    }
    const sportYear = `${sport}${year}`;
    return !inSeasonLeagues.includes(sportYear)
      ? insertIntoArray(DynastyStandingsColumnsRaw, 4, PlayoffColumns)
      : DynastyStandingsColumnsRaw;
  }, [isReady, sport, year]);

  const BasketballBaseballDivisionColumns = useMemo(
    () => [
      {
        Header: "Team Name",
        accessor: "teamName",
        tableHeaderCell: S.StringTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "W",
        accessor: "wins",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "L",
        accessor: "losses",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "T",
        accessor: "ties",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Win%",
        accessor: (data) => Number(data.winPer).toFixed(3),
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Games Back",
        accessor: "gamesBack",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: false,
      },
      {
        Header: "Division Record",
        accessor: "divisionRecord",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortType: divisionRecordSorter,
        sortDescFirst: true,
      },
    ],
    []
  );

  const FootballDivisionColumns = useMemo(
    () => [
      {
        Header: "Team Name",
        accessor: "teamName",
        tableHeaderCell: S.StringTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "W",
        accessor: "wins",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "L",
        accessor: "losses",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "T",
        accessor: "ties",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Win%",
        accessor: (data) => Number(data.winPer).toFixed(3),
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Points For",
        accessor: (data) => Number(data.pointsFor).toFixed(1),
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Points Against",
        accessor: (data) => Number(data.pointsAgainst).toFixed(1),
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: true,
      },
      {
        Header: "Games Back",
        accessor: "gamesBack",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortDescFirst: false,
      },
      {
        Header: "Division Record",
        accessor: "divisionRecord",
        tableHeaderCell: S.NumbersTableHeaderCell,
        sortType: divisionRecordSorter,
        sortDescFirst: true,
      },
    ],
    []
  );

  const divisionStandingsColumns = useMemo(() => {
    return sport === "football"
      ? FootballDivisionColumns
      : BasketballBaseballDivisionColumns;
  }, [sport, FootballDivisionColumns, BasketballBaseballDivisionColumns]);

  const orderedDivisionStandings = useMemo(() => {
    return Object.keys(divisionStandings).sort((a, b) => {
      return DIVISION_ORDER_ARRAY.indexOf(a) - DIVISION_ORDER_ARRAY.indexOf(b);
    });
  }, [divisionStandings]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} ${capitalize(sport)} Standings`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.SingleTableContainer>
            <S.TableTitle>Dynasty Standings</S.TableTitle>
            <Table
              columns={DynastyStandingsColumns}
              data={dynastyStandings}
              sortBy={[{ id: "totalDynastyPoints", desc: true }]}
              top3Styling
            />
          </S.SingleTableContainer>
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          {orderedDivisionStandings.map((division) => {
            if (division === "North" || division === "South") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={divisionStandingsColumns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            } else {
              return null;
            }
          })}
        </S.TwoTablesContainer>
        <S.TwoTablesContainer>
          {orderedDivisionStandings.map((division) => {
            if (division === "East" || division === "West") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={divisionStandingsColumns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            } else {
              return null;
            }
          })}
        </S.TwoTablesContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
