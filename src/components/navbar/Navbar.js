import React from "react";
import { BASE_ROUTES } from "../../Routes";
import * as S from "./Navbar.styles";

export const Navbar = () => {
  return (
    <S.Container>
      <ul>
        <S.Link to={BASE_ROUTES.Home}>Home link</S.Link>
        <S.Link to={BASE_ROUTES.TradeHistory}>Trade history link</S.Link>
      </ul>
    </S.Container>
  );
};
