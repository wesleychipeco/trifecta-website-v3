import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import isSameDay from "date-fns/isSameDay";

import {
  compileTrifectaStandings,
  h2hScrapeToStandings,
  rotoScrapeToStandings,
  standingsScraper,
} from "./BasketballStandingsHelpers";
import * as S from "styles/StandardScreen.styles";
import {
  TrifectaColumns,
  H2HColumns,
  RotoColumns,
  RotoStatsColumns,
  BasketballColumns,
} from "./BasketballColumns";
import { Table } from "components/table/Table";
import { isYear1AfterYear2, isYear1BeforeYear2 } from "utils/years";
import { insertIntoArray } from "utils/arrays";
import { api } from "utils/api";

export const BasketballStandings = () => {
  const { year } = useParams();
  const {
    currentYear,
    isBasketballStarted,
    isBasketballInSeason,
    basketballAhead,
  } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.trifecta,
  );
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

      // check if need to scrape or just display
      const check = async () => {
        const object = await api.get(`/trifecta/standings/basketball/${year}`);
        const { trifectaStandings, h2hStandings, rotoStandings } = object;

        if (isYear1BeforeYear2(year, "2020")) {
          setBasketballStandings(object.basketballStandings);
        }
        display(trifectaStandings, h2hStandings, rotoStandings);
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, ownerNamesMapping, year]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <S.TablesContainer>
            <S.TableTitle>Roto Standings</S.TableTitle>
            <Table
              columns={RotoColumns}
              data={rotoStandingsDisplay}
              sortBy={[{ id: "rotoTrifectaPoints", desc: true }]}
              top3Styling
            />
          </S.TablesContainer>
        </S.TwoTablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Roto Stats</S.TableTitle>
          <Table columns={RotoStatsColumns} data={rotoStandingsDisplay} />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
