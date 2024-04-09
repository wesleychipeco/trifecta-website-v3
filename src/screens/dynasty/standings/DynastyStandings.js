import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { capitalize } from "lodash";
import { returnMongoCollection } from "database-management";
import * as S from "styles/StandardScreen.styles";
import { Table } from "components/table/Table";
import { useSelector } from "react-redux";
import {
  Dynasty3x5DynastyPointsColumn,
  Dynasty3x5GmColumn,
} from "./StandingsColumns";
import { sportYearToSportAndYear } from "utils/years";

export const DynastyStandings = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  // eslint-disable-next-line no-unused-vars
  const { currentYear, inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  const [dynastyStandings, setDynastyStandings] = useState([]);

  useEffect(() => {
    if (isReady) {
      const display = async () => {
        const collection = await returnMongoCollection("dynastyStandings", era);
        const data = await collection.find({});
        const standings = data?.[0]?.standings ?? [];
        setDynastyStandings(standings);
      };

      display();
    }
  }, [isReady, era]);

  const DynastyColumns = useMemo(() => {
    const sampleColumns = Object.keys(dynastyStandings?.[0] ?? {});
    if (sampleColumns.length > 0) {
      const sportColumns = sampleColumns.map((eachColumn) => {
        const isYear = !isNaN(Number(eachColumn.slice(eachColumn.length - 4))); // if valid, last 4 characters can be turned into a number (ex: baseball2024)
        if (isYear) {
          const { sport, year } = sportYearToSportAndYear(eachColumn);
          return {
            Header: `${capitalize(sport)} ${year}`,
            accessor: eachColumn,
            tableHeaderCell: S.NumbersTableHeaderCell,
            sortDescFirst: true,
          };
        }
        return undefined;
      });

      // remove undefined
      const filteredSportColumns = sportColumns.filter(
        (each) => each !== undefined
      );

      return [
        Dynasty3x5GmColumn,
        ...filteredSportColumns,
        Dynasty3x5DynastyPointsColumn,
      ];
    }

    return [];
  }, [dynastyStandings]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>3x5 Dynasty Standings</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableCaption>
            ** Only completed sports are listed below **
          </S.TableCaption>
          <Table
            columns={DynastyColumns}
            data={dynastyStandings}
            sortBy={[{ id: "totalDynastyPoints", desc: true }]}
            top3Styling
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
