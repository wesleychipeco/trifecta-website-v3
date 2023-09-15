import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { capitalize } from "lodash";
import { BASE_ROUTES, STATIC_ROUTES } from "Routes";
import * as S from "styles/Navbar.styles";
import { closeNavbar } from "store/navbarSlice";
import { ERA_1 } from "Constants";

import TrifectaLogoHorizontalBlack from "resources/images/ShadedHorizontalLogo.png";
import { sportYearToSportAndYear } from "utils/years";
import { useAuth0 } from "@auth0/auth0-react";

export const OpenNavbar = () => {
  // redux state to manage seasonVariables
  const dispatch = useDispatch();

  // trifecta season variables
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

  // dynasty season variables
  const { inSeasonLeagues } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

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

  const { user } = useAuth0();

  // dynasty navbar
  if (location.pathname.startsWith("/dynasty")) {
    return (
      <S.OpenNavbarContainer>
        <S.HeaderContainer>
          <S.LogoLink to={STATIC_ROUTES.Home}>
            <S.HorizontalLogo src={TrifectaLogoHorizontalBlack} alt="logo" />
          </S.LogoLink>
        </S.HeaderContainer>
        <S.LinkContainer>
          <S.SecondRowDiv>
            <S.WelcomeText>{`Welcome, ${
              user?.name.split(" ")?.[0] ?? "Guest"
            }!`}</S.WelcomeText>
            <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
          </S.SecondRowDiv>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.DynastyStandings}`}
          >
            3x5 Dynasty Standings
          </S.Link>
          <S.CurrentStandings onClick={expandFunction}>
            Current Standings
          </S.CurrentStandings>
          {isStandingsExpanded &&
            inSeasonLeagues.map((inSeasonLeague) => {
              const { sport, year } = sportYearToSportAndYear(inSeasonLeague);
              return (
                <S.IndentedLink
                  key={inSeasonLeague}
                  to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/standings/${sport}/${year}`}
                >{`${year} ${capitalize(sport)} Standings`}</S.IndentedLink>
              );
            })}
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.TradeAssetHome}`}
          >
            Trade Assets Home
          </S.Link>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.TradeHistory}`}
          >
            Trade History
          </S.Link>
          <S.LinkStyle
            href="https://docs.google.com/document/d/e/2PACX-1vTIm5e2yuQH6z-_BkcbPe_5vgC2W098GkofewNtlk_pfsQiWlhJ0FU5BgKhQLp7Bw3uJXaXudl5gaBE/pub"
            target="_blank"
          >
            League Constitution
          </S.LinkStyle>
          <S.Link to={`${STATIC_ROUTES.TrifectaHome}`}>OG Trifecta</S.Link>
        </S.LinkContainer>
      </S.OpenNavbarContainer>
    );
  }

  // trifecta navbar
  return (
    <S.OpenNavbarContainer>
      <S.HeaderContainer>
        <S.LogoLink to={STATIC_ROUTES.Home}>
          <S.HorizontalLogo src={TrifectaLogoHorizontalBlack} alt="logo" />
        </S.LogoLink>
      </S.HeaderContainer>
      <S.LinkContainer>
        <S.SecondRowDiv>
          <S.WelcomeText>{`Welcome, ${
            user?.name.split(" ")?.[0] ?? "Guest"
          }!`}</S.WelcomeText>
          <S.CloseIcon icon="times" onClick={() => dispatch(closeNavbar())} />
        </S.SecondRowDiv>
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
        <S.Link to={`/`}>3x5 Dynasty</S.Link>
      </S.LinkContainer>
    </S.OpenNavbarContainer>
  );
};
