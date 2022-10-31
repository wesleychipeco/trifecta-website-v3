import React, { useEffect, useState } from "react";
import * as S from "styles/StandardScreen.styles";
import * as T from "styles/SportHallOfFame.styles";
import { returnMongoCollection } from "database-management";
import { Table } from "components/table/Table";
import {
  AllTimeRecordsColumns,
  BestH2HColumns,
  BestRotoColumns,
  PastChampionsColumns,
} from "./columns";

const DEFAULT_STATE = {
  allTimeRecords: [],
  pastChampions: [],
  bestH2H: [],
  bestRoto: [],
};

export const BasketballHallOfFame = () => {
  const [hallOfFameData, setHallOfFameData] = useState(DEFAULT_STATE);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("hallOfFame");
      const data = await collection.find({ sport: "basketball" });
      setHallOfFameData(data?.[0] ?? DEFAULT_STATE);
    };

    load();
  }, []);

  const { allTimeRecords, pastChampions, bestH2H, bestRoto } = hallOfFameData;
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>Basketball Hall of Fame</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Past Champions</S.TableTitle>
          <Table
            columns={PastChampionsColumns}
            data={pastChampions}
            sortBy={[{ id: "year", desc: false }]}
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>All-Time Records</S.TableTitle>
          <T.TableCaption>
            Roto points calculated starting in 2020
          </T.TableCaption>
          <Table
            columns={AllTimeRecordsColumns}
            data={allTimeRecords}
            sortBy={[{ id: "Win %", desc: true }]}
          />
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          <S.LeftTableContainer>
            <S.TableTitle>Top 5 H2H Standings</S.TableTitle>
            <Table
              columns={BestH2HColumns}
              data={bestH2H}
              sortBy={[{ id: "Win %", desc: true }]}
            />
          </S.LeftTableContainer>
          <S.TablesContainer>
            <S.TableTitle>Top 5 Roto Seasons</S.TableTitle>
            <Table
              columns={BestRotoColumns}
              data={bestRoto}
              sortBy={[{ id: "rotoPoints", desc: true }]}
            />
          </S.TablesContainer>
        </S.TwoTablesContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
