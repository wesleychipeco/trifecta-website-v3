import React, { useEffect, useMemo, useState } from "react";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { parse } from "papaparse";
import DraftResultsCSV from "resources/data/draft-results-basketball-startup.csv";
import { DraftCard } from "components/draft/DraftCard";
import * as S from "styles/DraftResults.styles";
import * as T from "styles/shared";

export const DraftResults = () => {
  const { era, sport, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);

  const [draftResultsHeader, setDraftResultsHeader] = useState([]);
  const [draftResultsGrid, setDraftResultsGrid] = useState([]);

  useEffect(() => {
    if (isReady) {
      parse(DraftResultsCSV, {
        download: true,
        complete: (contents) => {
          if (contents.errors.length == 0) {
            createGrid(contents.data);
          }
        },
      });
    }
  }, [isReady, era, sport, year]);

  const createGrid = (arrayOfArrays) => {
    const arrayOfRounds = [];
    let firstPickGM = "";

    let startingRound = 1;
    let arrayOfPicks = [];
    for (let i = 1; i < arrayOfArrays.length - 1; i++) {
      // Headers: Player ID, Round, Pick, Ov Pick, Pos, Player, Team, Fantasy Team
      const [_, round, pick, overallPick, position, player, team, fantasyTeam] =
        arrayOfArrays[i];

      // set first GM to know when to reverse
      if (i == 1) {
        firstPickGM = fantasyTeam;
      }

      if (round == startingRound + 1) {
        if (startingRound === 1) {
          setDraftResultsHeader(arrayOfPicks);
        }
        const toAdd =
          arrayOfPicks[0]?.fantasyTeam === firstPickGM
            ? arrayOfPicks
            : arrayOfPicks.reverse();

        arrayOfRounds.push(toAdd);
        startingRound += 1;
        arrayOfPicks = [];
      }

      const pickObject = {
        fantasyTeam,
        round,
        pick,
        overallPick,
        player,
        position,
        team,
      };

      arrayOfPicks.push(pickObject);
    }

    // after ending final loop, add last arrayOfPicks to arrayOfRounds
    const toAdd =
      arrayOfPicks[0]?.fantasyTeam === firstPickGM
        ? arrayOfPicks
        : arrayOfPicks.reverse();
    arrayOfRounds.push(toAdd);

    setDraftResultsGrid(arrayOfRounds);
  };

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${capitalize(sport)} ${capitalize(
        year
      )} Draft Results`}</S.Title>
      <S.FlexColumnContainer>
        <T.VerticalSpacer factor={4} />
        <S.FlexRowContainer>
          {draftResultsHeader.map((headerObject) => {
            return (
              <S.EachColumn key={headerObject.fantasyTeam}>
                <S.TeamHeaderText>{headerObject?.fantasyTeam}</S.TeamHeaderText>
              </S.EachColumn>
            );
          })}
        </S.FlexRowContainer>
        {draftResultsGrid.map((round, i) => {
          return (
            <S.FlexRowContainer key={i}>
              {round.map((pick) => {
                return (
                  <S.EachColumn key={pick?.overallPick}>
                    <DraftCard data={pick} sport={sport} />
                  </S.EachColumn>
                );
              })}
            </S.FlexRowContainer>
          );
        })}
      </S.FlexColumnContainer>
    </S.FlexColumnCenterContainer>
  );
};
