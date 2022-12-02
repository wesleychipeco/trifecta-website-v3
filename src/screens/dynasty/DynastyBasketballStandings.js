import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import * as S from "styles/StandardScreen.styles";
import { Table } from "components/table/Table";
import { standingsScraper, formatScrapedStandings } from "./StandingsHelper";
import {
  BasketballBaseballColumns,
  DynastyStandingsColumns,
} from "./StandingsColumns";
import { assignRankPoints } from "utils/standings";
import { HIGH_TO_LOW } from "Constants";

export const DynastyBasketballStandings = () => {
  const { era, year } = useParams();

  const [dynastyStandings, setDynastyStandings] = useState([]);
  const [divisionStandings, setDivisionStandings] = useState({
    North: [],
    South: [],
    East: [],
    West: [],
  });

  useEffect(() => {
    // TODO extract out scrape & calculate dyansty points functions
    const scrape = async () => {
      const leagueId = "aznbe7wvl8esmlyo"; // basketball
      // const leagueId = "2b0xp4cqkk5ztl6x"; // baseball
      const tableStandings = await standingsScraper(leagueId);
      const globalDivisionStandings = formatScrapedStandings(tableStandings);
      console.log("gds", globalDivisionStandings);

      setDivisionStandings(globalDivisionStandings);
      setDynastyStandings(
        assignRankPoints(
          Object.values(globalDivisionStandings).flat(1),
          "winPer",
          HIGH_TO_LOW,
          "dynastyPoints",
          16,
          1
        )
      );
    };

    scrape();
  }, []);

  console.log("hi", divisionStandings);
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Basketball Standings for ${era}`}</S.Title>
      <S.TablesContainer>
        <S.SingleTableContainer>
          <S.SingleTableContainer>
            <S.TableTitle>Dynasty Standings</S.TableTitle>
            <Table
              columns={DynastyStandingsColumns}
              data={dynastyStandings}
              sortBy={[{ id: "dynastyPoints", desc: true }]}
              top3Styling
            />
          </S.SingleTableContainer>
        </S.SingleTableContainer>
        <S.TwoTablesContainer>
          {Object.keys(divisionStandings).map((division) => {
            // TODO sort so order is N, S, E, W
            if (division === "North" || division === "South") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={BasketballBaseballColumns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            }
          })}
        </S.TwoTablesContainer>
        <S.TwoTablesContainer>
          {Object.keys(divisionStandings).map((division) => {
            if (division === "East" || division === "West") {
              return (
                <S.SingleTableContainer key={division}>
                  <S.TableTitle>{division}</S.TableTitle>
                  <Table
                    columns={BasketballBaseballColumns}
                    data={divisionStandings[division]}
                    sortBy={[{ id: "Win%", desc: true }]}
                    top3Styling
                  />
                </S.SingleTableContainer>
              );
            }
          })}
        </S.TwoTablesContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
