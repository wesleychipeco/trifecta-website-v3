import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { sportYearToSportAndYear } from "utils/years";
import { capitalize } from "lodash";

import * as S from "styles/TransactionsHistory.styles";
import * as T from "styles/StandardScreen.styles";
import { Button } from "components/button/Button";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import { STATIC_ROUTES } from "Routes";

export const PastStandingsHome = () => {
  const { era } = useParams();
  const dynastyCurrentVariables = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty,
  );
  const isReady = useSelector((state) => state?.currentVariables?.isReady);

  const [pastStandings, setPastStandings] = useState([]);

  useEffect(() => {
    if (isReady && dynastyCurrentVariables !== null) {
      const { completedLeagues } = dynastyCurrentVariables;
      const sportYearCompletedLeagues = completedLeagues.map(
        (completedLeague) => {
          const { sport, year } = sportYearToSportAndYear(completedLeague);
          return {
            sport,
            year,
            title: `${year} ${capitalize(sport)}`,
          };
        },
      );

      const splitPastStandings = splitIntoArraysOfLengthX(
        sportYearCompletedLeagues,
        3,
      );
      setPastStandings(splitPastStandings);
    }
  }, [isReady, dynastyCurrentVariables]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Past Sport Standings</T.Title>
      <S.TransactionsHistoryHomeContainer>
        {pastStandings.map((pastStandingsRow, i) => {
          return (
            <S.TransactionsHistoryHomeRowContainer key={i}>
              {pastStandingsRow.map((ps) => {
                console.log("PS", ps);

                return (
                  <Button
                    key={ps.title}
                    title={ps.title}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/standings/${ps.sport}/${ps.year}`}
                  />
                );
              })}
            </S.TransactionsHistoryHomeRowContainer>
          );
        })}
      </S.TransactionsHistoryHomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
