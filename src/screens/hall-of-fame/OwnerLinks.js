import React from "react";
import { Button } from "../../components/button/Button";
import { STATIC_ROUTES } from "../../Routes";
import * as S from "./OwnerLinks.styles";

export const OwnerLinks = ({ name, ownerNumber }) => {
  //   const matchupsLink = `${STATIC_ROUTES.Home}/`;
  return (
    <S.Container>
      <S.OwnerName>{`${name}'s`}</S.OwnerName>
      <S.ButtonsContainer>
        <Button title={"Records"} navTo={STATIC_ROUTES.GenericOwnerRecords} />
        <S.Spacer />
        <Button title={"Matchups"} navTo={STATIC_ROUTES.GenericOwnerMatchups} />
      </S.ButtonsContainer>
    </S.Container>
  );
};
