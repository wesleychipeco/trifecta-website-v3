import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { BASE_ROUTES } from "../../Routes";
import * as S from "./Navbar.styles";
import { closeNavbar } from "../../store/navbarSlice";

export const OpenNavbar = () => {
  const dispatch = useDispatch();
  const [currentPath, setCurrentPath] = useState("");
  const location = useLocation();

  useEffect(() => {
    // skip initial render when current path is empty still
    if (currentPath !== "") {
      dispatch(closeNavbar());
    }

    setCurrentPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <S.OpenNavbarContainer>
      <S.OpenBarsContainer>
        <S.Logo
          src={require("../../resources/images/trifectalogo.png")}
          alt="logo"
        />
        <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
      </S.OpenBarsContainer>
      <S.Link to={BASE_ROUTES.Home}>Home link</S.Link>
      <S.Link to={BASE_ROUTES.TradeHistory}>Trade history link</S.Link>
    </S.OpenNavbarContainer>
  );
};
