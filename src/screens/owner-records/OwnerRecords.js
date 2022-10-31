import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./OwnerRecords.styles";
import { returnMongoCollection } from "database-management";
import { Table } from "components/table/Table";
import {
  TrifectaHistoryColumns,
  AllTimeRecordsColumns,
  AllTimeBColumns,
  AllTimeFootballColumns,
} from "./columns";

const DEFAULT_STATE = {
  ownerNames: "",
  trifectaHistory: [],
  allTimeRecords: [],
  allTimeBasketball: [],
  allTimeBaseball: [],
  allTimeFootball: [],
};

export const OwnerRecords = () => {
  const { teamNumber } = useParams();
  const [ownerRecords, setOwnerRecodrs] = useState(DEFAULT_STATE);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("ownerProfiles");
      const data = await collection.find({ teamNumber: parseInt(teamNumber) });
      setOwnerRecodrs(data?.[0] ?? DEFAULT_STATE);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    ownerNames,
    trifectaHistory,
    allTimeRecords,
    allTimeBasketball,
    allTimeBaseball,
    allTimeFootball,
  } = ownerRecords;
  const ownerNamesDisplay = ownerNames ? `${ownerNames}'s` : "";

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${ownerNamesDisplay} All-Time Records`}</S.Title>
      <S.TablesContainer>
        <S.TwoTablesContainer>
          <S.LeftTableContainer>
            <S.TableTitle>Trifecta History</S.TableTitle>
            <Table
              columns={TrifectaHistoryColumns}
              data={trifectaHistory}
              sortBy={[{ id: "year", desc: false }]}
            />
          </S.LeftTableContainer>
          <S.TablesContainer>
            <S.TableTitle>By Sport Records</S.TableTitle>
            <Table columns={AllTimeRecordsColumns} data={allTimeRecords} />
          </S.TablesContainer>
        </S.TwoTablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Basketball Records</S.TableTitle>
          <Table columns={AllTimeBColumns} data={allTimeBasketball} />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Baseball Records</S.TableTitle>
          <Table columns={AllTimeBColumns} data={allTimeBaseball} />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Football Records</S.TableTitle>
          <Table columns={AllTimeFootballColumns} data={allTimeFootball} />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
