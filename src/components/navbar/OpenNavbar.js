import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import * as S from "styles/Navbar.styles";
import { closeNavbar } from "store/navbarSlice";
import { ERA_1 } from "Constants";

import TrifectaLogo from "resources/images/trifectalogo.png";

export const OpenNavbar = () => {
  // redux state to manage seasonVariables
  const dispatch = useDispatch();
  const seasonVariables = useSelector(
    (state) => state.currentVariables.seasonVariables.trifecta
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

    // console.log("location", location);
    setCurrentPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const expandFunction = useCallback(() => {
    toggleStandingsExpansion(!isStandingsExpanded);
  }, [toggleStandingsExpansion, isStandingsExpanded]);

  // dynasty navbar
  if (location.pathname.startsWith("/dynasty")) {
    return (
      <S.OpenNavbarContainer>
        <S.HeaderContainer>
          <S.Logo src={TrifectaLogo} alt="logo" />
          <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
        </S.HeaderContainer>
        <S.LinkContainer>
          <h2>Dynasty navbar!</h2>
          <S.Link to={STATIC_ROUTES.Home}>Home</S.Link>
          <S.Link to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}`}>
            Dynasty Home
          </S.Link>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/standings/basketball/2023`}
          >
            2023 Basketball Standings
          </S.Link>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/standings/baseball/2022`}
          >
            2022 Baseball Standings
          </S.Link>
        </S.LinkContainer>
      </S.OpenNavbarContainer>
    );
  }

  // trifecta navbar
  return (
    <S.OpenNavbarContainer>
      <S.HeaderContainer>
        <S.Logo src={TrifectaLogo} alt="logo" />
        <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
      </S.HeaderContainer>
      <S.LinkContainer>
        <S.Link to={STATIC_ROUTES.Home}>Home</S.Link>
        <S.Link to={STATIC_ROUTES.TrifectaHome}>Trifecta Home</S.Link>
        <S.CurrentStandings onClick={expandFunction}>
          Current Standings
        </S.CurrentStandings>
        {isStandingsExpanded && (
          <S.IndentedLink
            to={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.TrifectaStandings}/${currentYear}`}
          >
            {`${currentYear} Trifecta Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isBasketballStarted && (
          <S.IndentedLink
            to={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.BasketballStandings}/${currentYear}`}
          >
            {`${currentYear} Basketball Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isBaseballStarted && (
          <S.IndentedLink
            to={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.BaseballStandings}/${currentYear}`}
          >
            {`${currentYear} Baseball Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && isFootballStarted && (
          <S.IndentedLink
            to={`${STATIC_ROUTES.TrifectaHome}/${BASE_ROUTES.FootballStandings}/${currentYear}`}
          >
            {`${currentYear} Football Standings`}
          </S.IndentedLink>
        )}
        {isStandingsExpanded && basketballAhead && (
          <S.IndentedLink
            to={`${STATIC_ROUTES.TrifectaHome}/${
              BASE_ROUTES.BasketballStandings
            }/${Number(currentYear) + 1}`}
          >
            {`${Number(currentYear) + 1} Basketball Standings`}
          </S.IndentedLink>
        )}
        <S.Link
          to={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.TradeHistory}`}
        >
          Trade History
        </S.Link>
        <S.Link
          to={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.HallOfFame}`}
        >
          Hall of Fame
        </S.Link>
        <S.LinkStyle
          href="https://docs.google.com/document/d/e/2PACX-1vSXW_8gKkyCY1qz-2rWsUML5H3I38Hnz-K6aKvJjQoAqaqeVBnV_-mWTYxrobup6ALxPoDnKu4kbbwm/pub"
          target="_blank"
        >
          League Manual
        </S.LinkStyle>
      </S.LinkContainer>
    </S.OpenNavbarContainer>
  );
};
