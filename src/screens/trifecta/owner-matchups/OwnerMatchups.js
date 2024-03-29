import React, { useEffect, useState } from "react";
import { sortBy } from "lodash";
import { useParams } from "react-router-dom";
import * as S from "styles/StandardScreen.styles";
import * as T from "styles/OwnerScreen.styles";
import { returnMongoCollection } from "database-management";
import { Table } from "components/table/Table";
import {
  TotalMatchupsColumns,
  BMatchupsColumns,
  FootballMatchupsColumns,
} from "./columns";
import { MatchupsDropdown } from "components/dropdown/MatchupsDropdown";

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
  const [yearsArray, setYearsArray] = useState([]);

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
      const data = await collection.find({});
      const yearsOfMatchups = data.map((each) => each.year);
      const sortedYearsArray = sortBy(yearsOfMatchups);
      setYearsArray(sortedYearsArray);

      const selectedYearMatchups = data.filter((obj) => obj.year === year);
      setOwnerMatchups(selectedYearMatchups?.[0] ?? DEFAULT_STATE);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, teamNumber]);

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
      <T.Title>{`${ownerNamesDisplay} ${yearDisplay} Head-to-Head Matchups`}</T.Title>

      <S.TablesContainer>
        <T.LeftContainer>
          {yearsArray.length > 0 && (
            <T.Subtitle>{`Years Active: ${yearsArray[0]} - ${
              yearsArray[yearsArray.length - 2]
            } (${yearsArray.length - 1})`}</T.Subtitle>
          )}
          <T.DropdownContianer>
            <T.DropdownLabel>Switch Year:</T.DropdownLabel>
            <MatchupsDropdown
              arrayOfYears={yearsArray}
              teamNumber={teamNumber}
              year={year}
            />
          </T.DropdownContianer>
        </T.LeftContainer>
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
