import React from "react";
import { useDispatch } from "react-redux";
import * as S from "styles/Navbar.styles";
import { openNavbar } from "store/navbarSlice";
import { useLocation } from "react-router-dom";

export const ClosedNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <S.ClosedNavbarContainer onClick={() => dispatch(openNavbar())}>
      <S.ClosedBars icon="bars" />
    </S.ClosedNavbarContainer>
  );
};
