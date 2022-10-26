import React from "react";
import { Button } from "../../components/button/Button";
import { BASE_ROUTES, STATIC_ROUTES } from "../../Routes";
import * as S from "./OwnerLinks.styles";

export const OwnerLinks = ({ name, teamNumber }) => {
  //   const matchupsLink = `${STATIC_ROUTES.Home}/`;
  return (
    <S.Container>
      <S.OwnerName>{`${name}'s All-Time`}</S.OwnerName>
      <S.ButtonsContainer>
        <Button
          title={"Records"}
          navTo={`${BASE_ROUTES.OwnerRecords}/${teamNumber}`}
        />
        <S.Spacer />
        <Button title={"Matchups"} navTo={STATIC_ROUTES.GenericOwnerMatchups} />
      </S.ButtonsContainer>
    </S.Container>
  );
};
