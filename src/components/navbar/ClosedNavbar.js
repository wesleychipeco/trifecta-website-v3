import React, { useState } from "react";
import { useDispatch } from "react-redux";
import * as S from "styles/Navbar.styles";
import { openNavbar } from "store/navbarSlice";
import { useLocation } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import TrifectaLogoBlack from "resources/images/ShadedSymbolLogo.png";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const ClosedNavbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));

  if (
    location.pathname === "/" ||
    (isMobile && location.pathname === "/trifecta")
  ) {
    return null;
  }

  return (
    <S.ClosedNavbarContainer onClick={() => dispatch(openNavbar())}>
      <S.TrifectaSymbol src={TrifectaLogoBlack} />
    </S.ClosedNavbarContainer>
  );
};
