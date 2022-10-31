import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import * as S from "styles/Navbar.styles";
import { closeNavbar } from "store/navbarSlice";

import TrifectaLogo from "resources/images/trifectalogo.png";

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
    basketballAhead,
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
        {basketballAhead && (
          <S.Link
            to={`${BASE_ROUTES.BasketballStandings}/${Number(currentYear) + 1}`}
          >
            {`${Number(currentYear) + 1} Basketball Standings`}
          </S.Link>
        )}
        <S.CurrentStandings onClick={expandFunction}>
          Current Standings
        </S.CurrentStandings>
        {isStandingsExpanded && (
          <S.IndentedLink
            to={`${BASE_ROUTES.TrifectaStandings}/${currentYear}`}
          >
            {`${currentYear} Trifecta Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isBasketballStarted && (
          <S.IndentedLink
            to={`${BASE_ROUTES.BasketballStandings}/${currentYear}`}
          >
            {`${currentYear} Basketball Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isBaseballStarted && (
          <S.IndentedLink
            to={`${BASE_ROUTES.BaseballStandings}/${currentYear}`}
          >
            {`${currentYear} Baseball Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isFootballStarted && (
          <S.IndentedLink
            to={`${BASE_ROUTES.FootballStandings}/${currentYear}`}
          >
            {`${currentYear} Football Standings`}
          </S.IndentedLink>
        )}
        <S.Link to={STATIC_ROUTES.TradeHistory}>Trade History</S.Link>
        <S.Link to={STATIC_ROUTES.HallOfFame}>Hall of Fame</S.Link>
      </S.LinkContainer>
    </S.OpenNavbarContainer>
  );
};
