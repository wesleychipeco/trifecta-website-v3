import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { capitalize } from "lodash";
import { returnMongoCollection } from "database-management";
import * as S from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { Table } from "components/table/Table";
import Toggle from "react-toggle";
import { useSelector } from "react-redux";
import {
  Dynasty3x5DynastyPointsColumn,
  Dynasty3x5DynastyPointsInProgressColumn,
  Dynasty3x5GmColumn,
} from "./StandingsColumns";
import { sportYearToSportAndYear } from "utils/years";

const DEFAULT_TOGGLE_CHECKED = false;

export const DynastyStandings = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  // eslint-disable-next-line no-unused-vars
  const { inSeasonLeagues } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  const [dynastyStandings, setDynastyStandings] = useState([]);
  const [lastUpdatedDate, setLastUpdatedDate] = useState("");
  const [hideInProgressLeagues, setHideInProgressLeagues] = useState(
    DEFAULT_TOGGLE_CHECKED
  );

  const hiddenInSeasonLeagues = useMemo(() => {
    return hideInProgressLeagues
      ? [...inSeasonLeagues, "totalDynastyPointsInSeason"]
      : [];
  }, [hideInProgressLeagues, inSeasonLeagues]);

  useEffect(() => {
    if (isReady) {
      const display = async () => {
        const collection = await returnMongoCollection("dynastyStandings", era);
        const data = await collection.find({});
        const standings = data?.[0]?.standings ?? [];
        const lastUpdated = data?.[0]?.lastUpdated ?? "";
        const lastUpdatedIndex = lastUpdated.indexOf(",");
        const lastUpdatedDay = lastUpdated.substring(0, lastUpdatedIndex);
        setDynastyStandings(standings);
        setLastUpdatedDate(lastUpdatedDay);
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
          const optionalAsterisk = inSeasonLeagues.includes(eachColumn)
            ? "**"
            : "";
          return {
            Header: `${optionalAsterisk}${capitalize(
              sport
            )} ${year}${optionalAsterisk}`,
            accessor: eachColumn,
            tableHeaderCell: S.NumberCenteredTableHeaderCell,
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
        Dynasty3x5DynastyPointsInProgressColumn,
      ];
    }

    return [];
  }, [dynastyStandings, inSeasonLeagues]);

  const handleInSeasonChange = useCallback(
    (e) => {
      if (e.target.checked) {
        setHideInProgressLeagues(true);
      } else {
        setHideInProgressLeagues(false);
      }
    },
    [setHideInProgressLeagues]
  );

  const sortByArray = useMemo(() => {
    return hideInProgressLeagues
      ? [{ id: "totalDynastyPoints", desc: true }]
      : [{ id: "totalDynastyPointsInSeason", desc: true }];
  }, [hideInProgressLeagues]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>3x5 Dynasty Standings</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          {lastUpdatedDate && (
            <G.FlexRowStart>
              <S.TableCaption style={{ fontWeight: 800 }}>
                Last Updated:{" "}
              </S.TableCaption>
              <G.HorizontalSpacer factor={1} />
              <S.TableCaption>{lastUpdatedDate}</S.TableCaption>
            </G.FlexRowStart>
          )}
          <G.VerticalSpacer factor={2} />
          <G.FlexRowCentered>
            <S.TableCaption>Hide In-Progress Sports</S.TableCaption>
            <G.HorizontalSpacer factor={1} />
            <Toggle
              icons={false}
              onChange={handleInSeasonChange}
              defaultChecked={DEFAULT_TOGGLE_CHECKED}
            />
            <G.HorizontalSpacer factor={8} />
            {!hideInProgressLeagues && (
              <S.TableCaption>
                ** Denotes an In-Progress Sport **
              </S.TableCaption>
            )}
          </G.FlexRowCentered>
          <Table
            columns={DynastyColumns}
            data={dynastyStandings}
            sortBy={sortByArray}
            hiddenColumns={hiddenInSeasonLeagues}
            top3Styling
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
