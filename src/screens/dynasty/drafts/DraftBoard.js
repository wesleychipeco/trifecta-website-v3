import React, { useCallback, useEffect, useMemo, useState } from "react";
import { capitalize, cloneDeep } from "lodash";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { parse } from "papaparse";
import BasketballStartup from "resources/data/draft-results-basketball-startup.csv";
import BaseballStartup from "resources/data/draft-results-baseball-startup.csv";
import FootballStartup from "resources/data/draft-results-football-startup.csv";
import Basketball2025 from "resources/data/draft-results-basketball-2025.csv";
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

  const createGrid = useCallback(
    (arrayOfArrays) => {
      const arrayOfRounds = [];
      let firstPickGM = "";

      let startingRound = 1;
      let arrayOfPicks = [];
      for (let i = 1; i < arrayOfArrays.length - 1; i++) {
        // Headers: Player ID, Round, Pick, Ov Pick, Pos, Player, Team, Fantasy Team
        const [
          ,
          round,
          pick,
          overallPick,
          position,
          player,
          team,
          fantasyTeam, // date pt1 // date pt2
          ,
          ,
          tradedFrom,
        ] = arrayOfArrays[i];

        // set first GM to know when to reverse
        if (i === 1) {
          firstPickGM = fantasyTeam;
        }

        if (Number(round) === startingRound + 1) {
          if (startingRound === 1) {
            const copyArrayOfPicks = cloneDeep(arrayOfPicks);
            const headerArrayOfPicks = copyArrayOfPicks.map((headerPick) => {
              if (headerPick.tradedFrom) {
                headerPick.fantasyTeam = headerPick.tradedFrom;
              }
              return headerPick;
            });
            setDraftResultsHeader(headerArrayOfPicks);
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
          tradedFrom,
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
    },
    [year]
  );

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
      let csvToUse;
      if (sport === "basketball") {
        if (year === "startup") {
          csvToUse = BasketballStartup;
        } else if (year === "2025") {
          csvToUse = Basketball2025;
        }
      } else if (sport === "baseball") {
        if (year === "startup") {
          csvToUse = BaseballStartup;
        }
      } else if (sport === "football") {
        if (year === "startup") {
          csvToUse = FootballStartup;
        }
      }

      parse(csvToUse, {
        download: true,
        complete: (contents) => {
          if (contents.errors.length === 0) {
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
  }, [isReady, era, sport, year, createGrid]);

  const conditionalTitleText = useMemo(() => {
    return isCompleted ? "Results" : "Board";
  }, [isCompleted]);

  return (
    <S.FlexColumnCenterContainer>
      <S.TitleContainer>
        <S.Title>{`${capitalize(sport)} ${capitalize(
          year
        )} Draft ${conditionalTitleText}`}</S.Title>
      </S.TitleContainer>
      <S.FlexColumnContainer>
        <T.VerticalSpacer factor={4} />
        <S.FlexRowContainer>
          {draftResultsHeader.map((headerObject, index) => {
            return (
              <S.HeaderRow
                key={`${headerObject.fantasyTeam}-${index}`}
                fantasyTeam={headerObject.fantasyTeam}
                tradedTo={false}
              >
                <S.TeamHeaderText>{headerObject?.fantasyTeam}</S.TeamHeaderText>
              </S.HeaderRow>
            );
          })}
        </S.FlexRowContainer>
        {draftResultsGrid.map((round, i) => {
          return (
            <S.FlexRowContainer key={i}>
              {round.map((pick) => {
                return (
                  <S.GridPickContainer
                    key={pick?.overallPick}
                    sport={sport}
                    position={pick?.position}
                    fantasyTeam={pick?.fantasyTeam}
                    tradedTo={pick?.tradedTo ?? false}
                  >
                    <DraftCard
                      data={pick}
                      sport={sport}
                      isCompleted={isCompleted}
                    />
                  </S.GridPickContainer>
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
                    <S.PickPickContainer
                      key={pick?.pick}
                      position={pick?.position}
                      fantasyTeam={pick?.fantasyTeam}
                      tradedTo={pick?.tradedTo ?? false}
                    >
                      <DraftCard
                        data={pick}
                        sport={sport}
                        isCompleted={isCompleted}
                      />
                    </S.PickPickContainer>
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
