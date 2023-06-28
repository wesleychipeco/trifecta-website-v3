import React from "react";
import { useDispatch } from "react-redux";
import * as S from "styles/Navbar.styles";
import { openNavbar } from "store/navbarSlice";
import { useLocation } from "react-router-dom";
import TrifectaLogoBlack from "resources/images/Shaded_Symbol_Trifecta_Trns_Crop.png";

export const ClosedNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  if (location.pathname === "/") {
    return null;
  }

  return (
    <S.ClosedNavbarContainer onClick={() => dispatch(openNavbar())}>
      <S.TrifectaSymbol src={TrifectaLogoBlack} />
    </S.ClosedNavbarContainer>
  );
};
