import React from "react";
import { Button } from "components/button/Button";
import { BASE_ROUTES } from "Routes";
import * as S from "./OwnerLinks.styles";

export const OwnerLinks = ({ name, teamNumber }) => {
  return (
    <S.Container>
      <S.OwnerName>{`${name}'s All-Time`}</S.OwnerName>
      <S.ButtonsContainer>
        <Button
          title={"Records"}
          navTo={`${BASE_ROUTES.OwnerRecords}/${teamNumber}`}
        />
        <S.Spacer />
        <Button
          title={"Matchups"}
          navTo={`${BASE_ROUTES.OwnerMatchups}/${teamNumber}/all`}
        />
      </S.ButtonsContainer>
    </S.Container>
  );
};
