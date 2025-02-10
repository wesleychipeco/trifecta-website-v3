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

export const TransactionsHistoryHome = () => {
  const { era } = useParams();
  const dynastyCurrentVariables = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const isReady = useSelector((state) => state?.currentVariables?.isReady);

  const [availableSportYears, setAvailableSportYears] = useState([]);

  useEffect(() => {
    if (isReady && dynastyCurrentVariables !== null) {
      const { completedLeagues, inSeasonLeagues } = dynastyCurrentVariables;
      const transactionsAvailableLeagues = [
        ...completedLeagues,
        ...inSeasonLeagues,
      ];
      const sportYears = transactionsAvailableLeagues.map((sportYearKey) => {
        const { sport, year } = sportYearToSportAndYear(sportYearKey);
        return {
          sport,
          year,
          title: `${year} ${capitalize(sport)}`,
        };
      });

      const splitSportYears = splitIntoArraysOfLengthX(sportYears, 3);
      setAvailableSportYears(splitSportYears);
    }
  }, [isReady, dynastyCurrentVariables]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Transactions History</T.Title>
      <S.TransactionsHistoryHomeContainer>
        {availableSportYears.map((sportYear, i) => {
          return (
            <S.TransactionsHistoryHomeRowContainer key={i}>
              {sportYear.map((sy) => {
                return (
                  <Button
                    key={sy.title}
                    title={sy.title}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/transactions-history/${sy.sport}/${sy.year}`}
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
