import React from "react";
import { useDispatch } from "react-redux";
import * as S from "styles/Navbar.styles";
import { openNavbar } from "store/navbarSlice";

export const ClosedNavbar = () => {
  const dispatch = useDispatch();
  return (
    <S.ClosedNavbarContainer onClick={() => dispatch(openNavbar())}>
      <S.ClosedBars icon="bars" />
    </S.ClosedNavbarContainer>
  );
};
