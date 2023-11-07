import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "components/button/Button";
import { ROUTES, STATIC_ROUTES } from "Routes";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";

const COMMISSIONER_ACTION_BUTTONS = [
  {
    title: "Enter Trade History",
    path: ROUTES.CommissionerEnterTrade,
    disabled: false,
  },
  {
    title: "Trade Draft Picks",
    path: ROUTES.CommissionerTradeFutureDraftPicks,
    disabled: false,
  },
  {
    title: "Assign Startup Draft Slots",
    path: ROUTES.CommissionerAssignStartupDraftSlots,
    disabled: false,
  },
  {
    title: "Assign Supplemental Draft Slots",
    path: ROUTES.CommissionerAssignSupplementalDraftSlots,
    disabled: false,
  },
  {
    title: "Start New Sport",
    path: ROUTES.CommissionerStartNewSport,
    disabled: true,
  },
  {
    title: "End Sport Regular Season",
    path: ROUTES.CommissionerEndSportRegularSeason,
    disabled: true,
  },
  {
    title: "Complete Sport with Playoffs",
    path: ROUTES.CommissionerCompleteSport,
    disabled: true,
  },
  {
    title: "Initialize Supplemental Draft Picks",
    path: ROUTES.CommissionerInitializeSupplementalDraftPicks,
    disabled: false,
  },
];

export const CommissionerHome = () => {
  const { era } = useParams();
  const [buttonsArray, setButtonsArray] = useState([]);

  useEffect(() => {
    const splitArray = splitIntoArraysOfLengthX(COMMISSIONER_ACTION_BUTTONS, 3);
    setButtonsArray(splitArray);
  }, []);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Commissioner Actions Page</T.Title>
      <S.HomeContainer>
        {buttonsArray.map((row, i) => {
          return (
            <S.HomeRowContainer key={i}>
              {row.map((button) => {
                const { title, path, disabled } = button;
                return (
                  <Button
                    key={title}
                    title={title}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/${path}`}
                    disabled={disabled}
                  />
                );
              })}
            </S.HomeRowContainer>
          );
        })}
      </S.HomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
