import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import isSameDay from "date-fns/isSameDay";

import {
  compileTrifectaStandings,
  h2hScrapeToStandings,
  rotoScrapeToStandings,
  standingsScraper,
} from "./BaseballStandingsHelpers";
import * as S from "styles/StandardScreen.styles";
import {
  TrifectaColumns,
  H2HColumns,
  RotoColumns,
  RotoStatsColumns,
} from "./BaseballColumns";
import { Table } from "components/table/Table";
import { insertIntoArray } from "utils/arrays";
import { isYear1AfterYear2, isYear1BeforeYear2 } from "utils/years";
import { api } from "utils/api";

export const BaseballStandings = () => {
  const { year } = useParams();
  const { currentYear, isBaseballStarted, isBaseballInSeason } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.trifecta,
  );
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const ownerNamesMapping = useSelector((state) => state?.names?.ownerNames);

  const [trifectaStandingsDisplay, setTrifectaStandings] = useState([]);
  const [h2hStandingsDisplay, setH2HStandings] = useState([]);
  const [rotoStandingsDisplay, setRotoStandings] = useState([]);

  useEffect(() => {
    if (isReady) {
      // send to local state to display
      const display = (
        trifectaStandings,
        h2hStandings,
        rotoStandings,
        rotoStats = [],
      ) => {
        const rotoStatsFillIn = rotoStats ? rotoStats : rotoStandings;
        // For standings pre-2018, rotoStandings and rotoStats have different data
        // For standings 2018 and beyond, rotoStandings has all data needed
        const rotoCombined = [];
        rotoStandings.forEach((eachRotoStandings) => {
          const foundRotoStats = rotoStatsFillIn.find(
            (eachRotoStats) =>
              eachRotoStandings.teamName === eachRotoStats.teamName,
          );
          rotoCombined.push({
            ...eachRotoStandings,
            ...foundRotoStats,
          });
        });
        setTrifectaStandings(trifectaStandings);
        setH2HStandings(h2hStandings);
        setRotoStandings(rotoStats ? rotoCombined : rotoStandings);
      };

      // check if need to scrape or just display
      const check = async () => {
        const object = await api.get(`/trifecta/standings/baseball/${year}`);
        const { trifectaStandings, h2hStandings, rotoStandings, rotoStats } =
          object;

        display(trifectaStandings, h2hStandings, rotoStandings, rotoStats);
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, ownerNamesMapping, year]);

  const TrifectaStandingsColumns = useMemo(() => {
    return isYear1BeforeYear2(year, currentYear) ||
      (isBaseballStarted && !isBaseballInSeason && year === currentYear)
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

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Baseball Standings`}</S.Title>
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
          <S.TableTitle>Roto Standings</S.TableTitle>
          <Table
            columns={RotoColumns}
            data={rotoStandingsDisplay}
            sortBy={[{ id: "rotoTrifectaPoints", desc: true }]}
            top3Styling
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Roto Stats</S.TableTitle>
          <Table columns={RotoStatsColumns} data={rotoStandingsDisplay} />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
