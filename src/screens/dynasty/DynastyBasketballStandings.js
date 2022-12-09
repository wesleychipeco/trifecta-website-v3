import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import isSameDay from "date-fns/isSameDay";
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
import { useSelector } from "react-redux";

export const DynastyBasketballStandings = () => {
  const { era, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { currentYear, inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  const [dynastyStandings, setDynastyStandings] = useState([]);
  const [divisionStandings, setDivisionStandings] = useState({
    North: [],
    South: [],
    East: [],
    West: [],
  });

  useEffect(() => {
    if (isReady) {
      const sportYear = `basketball${year}`;
      const display = async (dynastyStandings, divisionStandings) => {
        setDynastyStandings(dynastyStandings);
        setDivisionStandings(divisionStandings);
      };

      const scrape = async (collection) => {
        const leagueId = leagueIdMappings[sportYear];
        const tableStandings = await standingsScraper(leagueId);
        const divisionStandings = formatScrapedStandings(tableStandings);
        const dynastyStandings = assignRankPoints(
          Object.values(divisionStandings).flat(1),
          "winPer",
          HIGH_TO_LOW,
          "dynastyPoints",
          16,
          1
        );

        display(dynastyStandings, divisionStandings);

        // delete, then save to mongodb
        console.log("Delete, then save to mongodb");
        await collection.deleteMany({ year });
        await collection.insertOne({
          year,
          lastScraped: new Date().toISOString(),
          dynastyStandings,
          divisionStandings,
        });
      };

      const check = async () => {
        const collection = await returnMongoCollection(
          "basketballStandings",
          era
        );
        const data = await collection.find({ year });
        const object = data?.[0] ?? {};
        const {
          lastScraped: lastScrapedString,
          dynastyStandings,
          divisionStandings,
        } = object;

        // ADD logic if sport+year is NOT in "inSeasonLeagues", then just display and return out
        if (!inSeasonLeagues.includes(sportYear)) {
          display(dynastyStandings, divisionStandings);
          return;
        }

        // if no last scraped string, always scrape
        if (!lastScrapedString) {
          scrape(collection);
        } else {
          // if alreadyd scraped today, just display
          const alreadyScraped = isSameDay(
            new Date(),
            new Date(lastScrapedString)
          );
          if (alreadyScraped) {
            display(dynastyStandings, divisionStandings);
          } else {
            scrape(collection);
          }
        }
      };

      check();
    }
  }, [isReady]);

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
            } else {
              return null;
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
            } else {
              return null;
            }
          })}
        </S.TwoTablesContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
