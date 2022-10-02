import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BASE_ROUTES, STATIC_ROUTES } from "../../Routes";
import * as S from "./Navbar.styles";
import { closeNavbar } from "../../store/navbarSlice";

import TrifectaLogo from "../../resources/images/trifectalogo.png";

export const OpenNavbar = () => {
  // redux state to manage seasonVariables
  const dispatch = useDispatch();
  const seasonVariables = useSelector(
    (state) => state.currentVariables.seasonVariables
  );
  const {
    currentYear,
    isBasketballStarted,
    isBaseballStarted,
    isFootballStarted,
  } = seasonVariables;

  // local state
  const [currentPath, setCurrentPath] = useState("");
  const [isStandingsExpanded, toggleStandingsExpansion] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // skip initial render when current path is empty still
    if (currentPath !== "") {
      dispatch(closeNavbar());
    }

    setCurrentPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const expandFunction = useCallback(() => {
    toggleStandingsExpansion(!isStandingsExpanded);
  }, [toggleStandingsExpansion, isStandingsExpanded]);

  return (
    <S.OpenNavbarContainer>
      <S.HeaderContainer>
        <S.Logo src={TrifectaLogo} alt="logo" />
        <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
      </S.HeaderContainer>
      <S.LinkContainer>
        <S.Link to={STATIC_ROUTES.Home}>Home</S.Link>
        <S.CurrentStandings onClick={expandFunction}>
          Current Standings
        </S.CurrentStandings>
        <S.Link to={`${BASE_ROUTES.BaseballStandings}/2021`}>
          2021 Baseball Standings
        </S.Link>
        <S.Link to={`${BASE_ROUTES.FootballStandings}/2021`}>
          2021 Football Standings
        </S.Link>
        {isStandingsExpanded && (
          <S.Link to={`${BASE_ROUTES.TrifectaStandings}/${currentYear}`}>
            Trifecta Standings
          </S.Link>
        )}
        {isStandingsExpanded && isBasketballStarted && (
          <S.Link to={`${BASE_ROUTES.BasketballStandings}/${currentYear}`}>
            Basketball Standings
          </S.Link>
        )}
        {isStandingsExpanded && isBaseballStarted && (
          <S.Link to={`${BASE_ROUTES.BaseballStandings}/${currentYear}`}>
            Baseball Standings
          </S.Link>
        )}
        {isStandingsExpanded && isFootballStarted && (
          <S.Link to={`${BASE_ROUTES.FootballStandings}/${currentYear}`}>
            Football Standings
          </S.Link>
        )}
        <S.Link to={STATIC_ROUTES.TradeHistory}>Trade History</S.Link>
      </S.LinkContainer>
    </S.OpenNavbarContainer>
  );
};
