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
import { insertIntoArray } from "utils/arrays";
import { assignRankPoints } from "utils/standings";
import { api } from "utils/api";

export const FootballStandings = () => {
  const { year } = useParams();
  const { currentYear, isFootballStarted, isFootballInSeason } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.trifecta,
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
        top5Bottom5Standings,
      ) => {
        if (top5Bottom5Standings) {
          const weeksLength = Object.keys(top5Bottom5Standings?.[0]).filter(
            (key) => key.includes("week"),
          ).length;
          setNumberOfWeeks(weeksLength);
        }
        setTrifectaStandings(trifectaStandings);
        setH2HStandings(h2hStandings);
        setTop5Bottom5Standings(top5Bottom5Standings);
      };

      // check if need to scrape or just display
      const check = async () => {
        const object = await api.get(`/trifecta/standings/football/${year}`);
        const {
          trifectaStandings,
          h2hStandings,
          top5Bottom5Standings,
          footballStandings,
        } = object;

        if (isYear1BeforeYear2(year, "2020")) {
          setFootballStandings(footballStandings);
        } else {
          display(trifectaStandings, h2hStandings, top5Bottom5Standings);
        }
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
