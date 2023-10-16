import { returnMongoCollection } from "database-management";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "components/button/Button";
import { capitalize } from "lodash";
import { STATIC_ROUTES } from "Routes";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import * as S from "styles/DraftBoard.styles";
import * as T from "styles/StandardScreen.styles";

export const DraftsHome = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [completedDraftsArray, setCompletedDraftsArray] = useState([]);
  const [futureDraftsArray, setFutureDraftsArray] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const draftCollection = await returnMongoCollection("drafts", era);
      const draftData = await draftCollection.find({ type: "status" });
      const draft = draftData?.[0] ?? {};
      const { completedDrafts, futureDrafts } = draft;

      setCompletedDraftsArray(splitIntoArraysOfLengthX(completedDrafts, 3));
      setFutureDraftsArray(splitIntoArraysOfLengthX(futureDrafts, 3));
    };

    loadData();
  }, [isReady]);

  const buttonTextFunction = useCallback(
    (draftSportYear) => {
      const draftSportYearArray = draftSportYear.split("-");
      const [sport, year] = draftSportYearArray;
      const title =
        year === "startup"
          ? `${capitalize(sport)} ${capitalize(year)}`
          : `${year} Supplemental ${capitalize(sport)}`;

      return {
        title,
        sport,
        year,
      };
    },
    [isReady]
  );

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Drafts Home Page</T.Title>
      <S.DraftsHomeContainer>
        <S.DraftsHeader>Completed Draft Results</S.DraftsHeader>
        {completedDraftsArray.map((row, i) => {
          return (
            <S.DraftsHomeRowContainer key={i}>
              {row.map((draft) => {
                const { title, sport, year } = buttonTextFunction(draft);
                return (
                  <Button
                    key={draft}
                    title={title}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/draft/${sport}/${year}`}
                  />
                );
              })}
            </S.DraftsHomeRowContainer>
          );
        })}
      </S.DraftsHomeContainer>
      <S.DraftsHomeContainer>
        <S.DraftsHeader>{`Future Draft Boards (In Development)`}</S.DraftsHeader>
        {futureDraftsArray.map((row, i) => {
          return (
            <S.DraftsHomeRowContainer key={i}>
              {row.map((draft) => {
                const { title, sport, year } = buttonTextFunction(draft);
                return (
                  <Button
                    key={draft}
                    title={title}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/draft/${sport}/${year}`}
                    disabled={year !== "startup"}
                  />
                );
              })}
            </S.DraftsHomeRowContainer>
          );
        })}
      </S.DraftsHomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
