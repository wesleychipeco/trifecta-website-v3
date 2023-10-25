import React, { useCallback, useEffect, useMemo, useState } from "react";
import { capitalize } from "lodash";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { parse } from "papaparse";
import DraftResultsCSV from "resources/data/draft-results-basketball-startup.csv";
import { DraftCard } from "components/draft/DraftCard";
import * as S from "styles/DraftBoard.styles";
import * as T from "styles/shared";
import { returnMongoCollection } from "database-management";

export const DraftBoard = () => {
  const { era, sport, year } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);

  const [draftResultsHeader, setDraftResultsHeader] = useState([]);
  const [draftResultsGrid, setDraftResultsGrid] = useState([]);
  const [draftResultsPicks, setDraftResultsPicks] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const checkForCompletedOrFuture = async () => {
      const draftsCollection = await returnMongoCollection("drafts", era);
      const draftsData = await draftsCollection.find();
      const draftStatusObject =
        draftsData.filter((record) => record.type === "status")?.[0] ?? {};
      const { completedDrafts } = draftStatusObject;

      const sportYear = `${sport}-${year}`;
      const isCompletedDraft = completedDrafts.includes(sportYear);
      setIsCompleted(isCompletedDraft);

      if (isCompletedDraft) {
        loadCompletedDraft();
      } else {
        const draftGrid =
          draftsData.filter((record) => record.type === sportYear)?.[0] ?? {};
        loadFutureDraft(draftGrid);
      }
    };

    const loadCompletedDraft = () => {
      parse(DraftResultsCSV, {
        download: true,
        complete: (contents) => {
          if (contents.errors.length == 0) {
            createGrid(contents.data);
          }
        },
      });
    };

    const loadFutureDraft = ({ grid, picks }) => {
      if (grid) {
        setDraftResultsHeader(grid[0]);
        setDraftResultsGrid(grid);
      } else if (picks) {
        const headerRow = picks.map((eachGm) => {
          return {
            fantasyTeam: eachGm[0]["fantasyTeam"],
          };
        });

        setDraftResultsHeader(headerRow);
        setDraftResultsPicks(picks);
      }
    };

    // enter function
    if (isReady) {
      checkForCompletedOrFuture();
    }
  }, [isReady, era, sport, year]);

  const createGrid = useCallback((arrayOfArrays) => {
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

        // need to test non-startup (non reversal) supplemental drafts
        const toAdd =
          arrayOfPicks[0]?.fantasyTeam === firstPickGM && year === "startup"
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
    // console.log("GRID!!!!!!!!!!", arrayOfRounds);
  }, []);

  const conditionalTitleText = useMemo(() => {
    return isCompleted ? "Results" : "Board";
  }, [isCompleted]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`${capitalize(sport)} ${capitalize(
        year
      )} Draft ${conditionalTitleText}`}</S.Title>
      <S.FlexColumnContainer>
        <T.VerticalSpacer factor={4} />
        <S.FlexRowContainer>
          {draftResultsHeader.map((headerObject) => {
            return (
              <S.ColumnWidthRow key={headerObject.fantasyTeam}>
                <S.TeamHeaderText>{headerObject?.fantasyTeam}</S.TeamHeaderText>
              </S.ColumnWidthRow>
            );
          })}
        </S.FlexRowContainer>
        {draftResultsGrid.map((round, i) => {
          return (
            <S.FlexRowContainer key={i}>
              {round.map((pick) => {
                return (
                  <S.ColumnWidthRow key={pick?.overallPick}>
                    <DraftCard
                      data={pick}
                      sport={sport}
                      isCompleted={isCompleted}
                    />
                  </S.ColumnWidthRow>
                );
              })}
            </S.FlexRowContainer>
          );
        })}
        <S.FlexRowContainer>
          {draftResultsPicks.map((gm, i) => {
            return (
              <S.ColumnWidthColumn key={i}>
                {gm.map((pick) => {
                  return (
                    <S.FlexColumnContainerWithBorder key={pick?.pick}>
                      <DraftCard
                        data={pick}
                        sport={sport}
                        isCompleted={isCompleted}
                      />
                    </S.FlexColumnContainerWithBorder>
                  );
                })}
              </S.ColumnWidthColumn>
            );
          })}
        </S.FlexRowContainer>
      </S.FlexColumnContainer>
      <T.VerticalSpacer factor={4} />
    </S.FlexColumnCenterContainer>
  );
};
