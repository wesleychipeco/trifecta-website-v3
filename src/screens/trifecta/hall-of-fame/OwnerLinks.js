import React from "react";
import { Button } from "components/button/Button";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import * as S from "styles/OwnerLinks.styles";

export const OwnerLinks = ({ name, teamNumber }) => {
  return (
    <S.Container>
      <S.OwnerName>{`${name}'s All-Time`}</S.OwnerName>
      <S.ButtonsContainer>
        <Button
          title={"Records"}
          navTo={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.OwnerRecords}/${teamNumber}`}
        />
        <S.Spacer />
        <Button
          title={"Matchups"}
          navTo={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.OwnerMatchups}/${teamNumber}/all`}
        />
      </S.ButtonsContainer>
    </S.Container>
  );
};
