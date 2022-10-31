import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";

import * as S from "styles/StandardScreen.styles";
import * as T from "styles/TrifectaStandings.styles";
import * as G from "styles/shared";
import {
  TrifectaColumnsPre2019,
  TrifectaColumnsPost2019,
} from "./TrifectaColumns";
import {
  determineSeasonStatus,
  isYear1AfterYear2,
  isYear1BeforeYear2,
  SeasonStatus,
} from "utils/years";
import { Table } from "components/table/Table";
import { returnMongoCollection } from "database-management";
import { calculateTrifectaStandings } from "./TrifectaStandingsHelpers";
import { BASE_ROUTES } from "Routes";

export const TrifectaStandings = () => {
  const { year } = useParams();
  const {
    currentYear,
    isBasketballStarted,
    isBasketballInSeason,
    isBaseballStarted,
    isBaseballInSeason,
    isFootballStarted,
    isFootballInSeason,
  } = useSelector((state) => state?.currentVariables?.seasonVariables);
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const ownerNamesMapping = useSelector((state) => state?.names?.ownerNames);

  const [trifectaStandingsDisplay, setTrifectaStandings] = useState([]);
  const [updatedAsOfDisplay, setUpdatedAsOf] = useState("");
  const [updateRoute, setUpdateRoute] = useState("");

  useEffect(() => {
    if (isReady) {
      // send to local state to display
      const display = (trifectaStandings, lastScraped) => {
        setTrifectaStandings(trifectaStandings);
        setUpdatedAsOf(lastScraped);
      };

      // scrape, then display, then save to mongodb with new last scraped
      const scrape = async (collection, seasonStatusArray) => {
        if (Object.keys(ownerNamesMapping).length > 0) {
          const { trifectaStandings, updatedAsOf } =
            await calculateTrifectaStandings(
              year,
              seasonStatusArray[0],
              seasonStatusArray[1],
              seasonStatusArray[2]
            );
          display(trifectaStandings);
          setUpdatedAsOf(updatedAsOf);

          // delete, then save to mongodb
          console.log("Delete, then save to mongodb");
          await collection.deleteMany({ year });
          await collection.insertOne({
            year,
            lastScraped: updatedAsOf
              ? format(new Date(updatedAsOf), "MM/dd/yy hh:mm a")
              : format(new Date(), "MM/dd/yy hh:mm a"),
            trifectaStandings,
          });
        }
      };

      // check if need to scrape or just display
      const check = async () => {
        const collection = await returnMongoCollection("trifectaStandings");
        const data = await collection.find({ year });
        const object = data[0] ?? {};
        const lastScrapedString = object?.lastScraped;
        const { trifectaStandings, lastScraped } = object;

        const basketballSeasonStatus = determineSeasonStatus(
          isBasketballStarted,
          isBasketballInSeason
        );
        const baseballSeasonStatus = determineSeasonStatus(
          isBaseballStarted,
          isBaseballInSeason
        );
        const footballSeasonStatus = determineSeasonStatus(
          isFootballStarted,
          isFootballInSeason
        );

        const seasonStatusArray = [
          basketballSeasonStatus,
          baseballSeasonStatus,
          footballSeasonStatus,
        ];
        const inProgressIndex = seasonStatusArray.indexOf(
          SeasonStatus.IN_PROGRESS
        );
        let linkRoute = "";
        switch (inProgressIndex) {
          case 0:
            linkRoute = "Basketball Standings";
            break;
          case 1:
            linkRoute = "Baseball Standings";
            break;
          case 2:
            linkRoute = "Football Standings";
            break;
          default:
            break;
        }
        setUpdateRoute(linkRoute);

        // if not current year or not started or in season, then just display, do not scrape
        if (year !== currentYear) {
          if (isYear1AfterYear2(year, currentYear)) {
            console.log("AHEAD of TIME!");
          } else {
            display(trifectaStandings, lastScraped);
          }
          return;
        }

        // if there is no last scraped string (ie brand new, first time entering), scrape
        if (!lastScrapedString) {
          console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
          // return;
          scrape(collection, seasonStatusArray);
        } else {
          const now = new Date();
          const alreadyScraped = isSameDay(now, new Date(lastScrapedString));

          // only scrape if not already scraped today
          if (!alreadyScraped) {
            console.log("SHOULD SCRAPE BUT DO NOT FOR TESTING");
            // return;
            scrape(collection, seasonStatusArray);
          } else {
            display(trifectaStandings, lastScraped);
          }
        }
      };

      ///////////// only 1 function gets run inside useEffect /////////////
      check();
    }
  }, [isReady, ownerNamesMapping]);

  const TrifectaStandingsColumns = isYear1BeforeYear2(year, "2019")
    ? TrifectaColumnsPre2019
    : TrifectaColumnsPost2019;

  const shouldDisplayUpdateMessage = !isSameDay(
    new Date(),
    new Date(updatedAsOfDisplay)
  );

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${year} Trifecta Standings`}</S.Title>
      {shouldDisplayUpdateMessage && updatedAsOfDisplay && (
        <G.FlexColumn>
          <S.TableTitle>{`Last updated: ${updatedAsOfDisplay}`}</S.TableTitle>
          <G.FlexRow>
            <T.TableCaption>
              To update, load in-progress sport's standings:
            </T.TableCaption>
            <T.Link
              to={`${BASE_ROUTES[updateRoute.replace(" ", "")]}/${currentYear}`}
            >{`${currentYear} ${updateRoute}`}</T.Link>
          </G.FlexRow>
        </G.FlexColumn>
      )}
      <S.TablesContainer>
        <S.SingleTableContainer>
          <Table
            columns={TrifectaStandingsColumns}
            data={trifectaStandingsDisplay}
            sortBy={[{ id: "totalTrifectaPoints", desc: true }]}
            top3Styling
          />
        </S.SingleTableContainer>
      </S.TablesContainer>
    </S.FlexColumnCenterContainer>
  );
};
