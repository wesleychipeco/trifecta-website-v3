import React from "react";
import * as S from "styles/Button.styles";

export const Button = ({ title, navTo }) => {
  return (
    <S.Container>
      <S.Link to={navTo}>{title}</S.Link>
    </S.Container>
  );
};
