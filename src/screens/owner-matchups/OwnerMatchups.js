import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "./OwnerMatchups.styles";
import { returnMongoCollection } from "../../database-management";
import { Table } from "../../components/table/Table";
import {
  TotalMatchupsColumns,
  BMatchupsColumns,
  FootballMatchupsColumns,
} from "./columns";

const DEFAULT_STATE = {
  totalMatchups: [],
  basketballMatchups: [],
  baseballMatchups: [],
  footballMatchups: [],
};

export const OwnerMatchups = () => {
  const { year, teamNumber } = useParams();
  const [ownerMatchups, setOwnerMatchups] = useState(DEFAULT_STATE);
  const [ownerNames, setOwnerNames] = useState("");

  useEffect(() => {
    const load = async () => {
      const allTimesTeamCollection = await returnMongoCollection(
        "allTimeTeams"
      );
      const data1 = await allTimesTeamCollection.find({
        teamNumber,
      });
      setOwnerNames(data1?.[0]?.ownerNames ?? "");

      const collection = await returnMongoCollection(
        `owner${teamNumber}Matchups`
      );
      const data = await collection.find({ year });
      setOwnerMatchups(data?.[0] ?? DEFAULT_STATE);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    totalMatchups,
    basketballMatchups,
    baseballMatchups,
    footballMatchups,
  } = ownerMatchups;
  const ownerNamesDisplay = ownerNames ? `${ownerNames}'s` : "";
  const yearDisplay = year === "all" ? "All-Time" : year;

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${ownerNamesDisplay} ${yearDisplay} Head-to-Head Matchups`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Total Matchups</S.TableTitle>
          <Table
            columns={TotalMatchupsColumns}
            data={totalMatchups}
            sortBy={[{ id: "Total Win%", desc: true }]}
          />
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          <S.LeftTableContainer>
            <S.TableTitle>Basketball Matchups</S.TableTitle>
            <Table
              columns={BMatchupsColumns}
              data={basketballMatchups}
              sortBy={[{ id: "Win %", desc: true }]}
            />
          </S.LeftTableContainer>
          <S.TablesContainer>
            <S.TableTitle>Baseball Matchups</S.TableTitle>
            <Table
              columns={BMatchupsColumns}
              data={baseballMatchups}
              sortBy={[{ id: "Win %", desc: true }]}
            />
          </S.TablesContainer>
        </S.TwoTablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Football Matchups</S.TableTitle>
          <Table
            columns={FootballMatchupsColumns}
            data={footballMatchups}
            sortBy={[{ id: "Win %", desc: true }]}
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
