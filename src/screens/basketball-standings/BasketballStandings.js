import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Table } from "../../components/table/Table";
import * as G from "../../styles/shared";
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
} from "./columns";

export const BasketballStandings = () => {
  const { year } = useParams();
  const ownerNamesMapping = useSelector((state) => state?.names?.ownerNames);

  const [trifectaStandingsDisplay, setTrifectaStandings] = useState([]);
  const [h2hStandingsDisplay, setH2HStandings] = useState([]);
  const [rotoStandingsDisplay, setRotoStandings] = useState([]);

  useEffect(() => {
    const scrape = async () => {
      if (Object.keys(ownerNamesMapping).length > 0) {
        const { h2hScrape, rotoScrape } = await standingsScraper(year);

        const h2hStandings = await h2hScrapeToStandings(h2hScrape);
        const rotoStandings = await rotoScrapeToStandings(rotoScrape);
        const trifectaStandings = await compileTrifectaStandings(
          h2hStandings,
          rotoStandings,
          ownerNamesMapping
        );

        setTrifectaStandings(trifectaStandings);
        setH2HStandings(h2hStandings);
        console.log("ROS", rotoStandings);
        setRotoStandings(rotoStandings);
      }
    };

    scrape();
  }, [ownerNamesMapping]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Basketball Standings`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Trifecta Standings</S.TableTitle>
          <Table
            columns={TrifectaColumns}
            data={trifectaStandingsDisplay}
            sortBy={[{ id: "totalTrifectaPoints", desc: true }]}
          />
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          <S.LeftTableContainer>
            <S.TableTitle>H2H Standings</S.TableTitle>
            <Table
              columns={H2HColumns}
              data={h2hStandingsDisplay}
              sortBy={[{ id: "h2hTrifectaPoints", desc: true }]}
            />
          </S.LeftTableContainer>
          <div>
            <S.TableTitle>Roto Standings</S.TableTitle>
            <Table
              columns={RotoColumns}
              data={rotoStandingsDisplay}
              sortBy={[{ id: "rotoTrifectaPoints", desc: true }]}
            />
          </div>
        </S.TwoTablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Roto Stats</S.TableTitle>
          <Table columns={RotoStatsColumns} data={rotoStandingsDisplay} />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
