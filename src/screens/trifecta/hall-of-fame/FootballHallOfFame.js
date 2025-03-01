import React, { useEffect, useState } from "react";
import * as S from "styles/StandardScreen.styles";
import * as T from "styles/SportHallOfFame.styles";
import { returnMongoCollection } from "database-management";
import { Table } from "components/table/Table";
import {
  FootballAllTimeRecordsColumns,
  FootballPastChampionsColumns,
  Football10WinH2HColumns,
  FootballHighestSingleWeekColumns,
} from "./columns";
import { FOOTBALL } from "Constants";

const DEFAULT_STATE = {
  allTimeRecords: [],
  pastChampions: [],
  bestH2H: [],
  bestWeeks: [],
};

export const FootballHallOfFame = () => {
  const [hallOfFameData, setHallOfFameData] = useState(DEFAULT_STATE);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("hallOfFame");
      const data = await collection.find({ sport: FOOTBALL });
      setHallOfFameData(data?.[0] ?? DEFAULT_STATE);
    };

    load();
  }, []);

  const { allTimeRecords, pastChampions, bestH2H, bestWeeks } = hallOfFameData;
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>Football Hall of Fame</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Past Champions</S.TableTitle>
          <Table
            columns={FootballPastChampionsColumns}
            data={pastChampions}
            sortBy={[{ id: "year", desc: false }]}
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>All-Time Records</S.TableTitle>
          <T.TableCaption>
            Excludes 2018, which was not part of Trifecta cycle due to
            re-alignment
          </T.TableCaption>
          <Table
            columns={FootballAllTimeRecordsColumns}
            data={allTimeRecords}
            sortBy={[{ id: "Win %", desc: true }]}
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>10+ Win H2H Seasons</S.TableTitle>
          <Table
            columns={Football10WinH2HColumns}
            data={bestH2H}
            sortBy={[{ id: "Win %", desc: true }]}
          />
        </S.SingleTableContainer>
        <S.SingleTableContainer>
          <S.TableTitle>Top 5 Highest Scoring Single Weeks</S.TableTitle>
          <T.TableCaption>
            Highest single week scores from previous scoring formats are also
            recorded below.
          </T.TableCaption>
          <T.TableCaption>
            *In 2017, scoring changed from standard to 0.5 PPR.
          </T.TableCaption>
          <T.TableCaption>
            **In 2020, additional FLEX starting lineup spot added.
          </T.TableCaption>

          <Table
            columns={FootballHighestSingleWeekColumns}
            data={bestWeeks}
            sortBy={[{ id: "Points Scored", desc: true }]}
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
