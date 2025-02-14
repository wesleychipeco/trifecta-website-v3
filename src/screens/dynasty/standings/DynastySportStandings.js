import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { capitalize } from "lodash";
import { returnMongoCollection } from "database-management";
import * as S from "styles/StandardScreen.styles";
import { Table } from "components/table/Table";
import {
  DynastyStandingsColumnsRaw,
  PlayoffColumns,
  FootballPointsColumns,
} from "./StandingsColumns";
import { useSelector } from "react-redux";
import { calculateWinPer } from "utils/winPer";
import { insertIntoArray } from "utils/arrays";

const DIVISION_ORDER_ARRAY = ["North", "South", "East", "West"];

export const DynastySportStandings = ({ sport }) => {
  const { era, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues } = useSelector(
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
      const display = async () => {
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

        console.log("Last scraped (Local Time): ", lastScrapedString);
        setDynastyStandings(dynastyStandings);
        setDivisionStandings(divisionStandings);
      };

      display();
    }
  }, [isReady, sport, year, era]);

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
    const dynastyStandingsColumns =
      sport === "football"
        ? insertIntoArray(DynastyStandingsColumnsRaw, 4, FootballPointsColumns)
        : DynastyStandingsColumnsRaw;

    const playoffsIndex = sport === "football" ? 6 : 4;
    return !inSeasonLeagues.includes(sportYear)
      ? insertIntoArray(dynastyStandingsColumns, playoffsIndex, PlayoffColumns)
      : dynastyStandingsColumns;
  }, [isReady, sport, year, inSeasonLeagues]);

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
    [divisionRecordSorter]
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
    [divisionRecordSorter]
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
