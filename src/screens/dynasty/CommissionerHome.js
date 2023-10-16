import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "components/button/Button";
import { ROUTES, STATIC_ROUTES } from "Routes";
import { splitInto2Arrays } from "utils/arrays";
import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";

const COMMISSIONER_ACTION_BUTTONS = [
  {
    title: "Enter Trade",
    path: ROUTES.CommissionerEnterTrade,
    disabled: false,
  },
  {
    title: "Assign Startup Draft Slots",
    path: ROUTES.CommissionerAssignStartupDraftSlots,
    disabled: true,
  },
  {
    title: "Assign Supplemental Draft Slots",
    path: ROUTES.CommissionerAssignSupplementalDraftSlots,
    disabled: true,
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
];

export const CommissionerHome = () => {
  const { era } = useParams();
  const [buttonsArray, setButtonsArray] = useState([]);

  useEffect(() => {
    // pull database info here
    console.log("era", era);
    const splitArray = splitInto2Arrays(COMMISSIONER_ACTION_BUTTONS);
    setButtonsArray(splitArray);
  }, [era]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Commissioner Actions Page</T.Title>
      <S.CommissionerHomeContainer>
        {buttonsArray.map((row, i) => {
          return (
            <S.CommissionerHomeRowContainer key={i}>
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
            </S.CommissionerHomeRowContainer>
          );
        })}
      </S.CommissionerHomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
