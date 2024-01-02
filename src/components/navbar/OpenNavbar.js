import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { capitalize } from "lodash";
import { STATIC_ROUTES } from "Routes";
import * as S from "styles/Navbar.styles";
import * as T from "styles/shared";
import { closeNavbar } from "store/navbarSlice";
import { ERA_1 } from "Constants";

import TrifectaLogoHorizontalBlack from "resources/images/ShadedHorizontalLogo.png";
import { sportYearToSportAndYear } from "utils/years";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const OpenNavbar = () => {
  // redux state to manage seasonVariables
  const dispatch = useDispatch();
  const version = useMemo(() => {
    const { version } = require("../../../package.json");
    return version;
  }, []);

  // dynasty season variables
  const { inSeasonLeagues } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  // local state
  const [currentPath, setCurrentPath] = useState("");
  const [isStandingsExpanded, toggleStandingsExpansion] = useState(false);
  const [isCommissioner, setIsCommissioner] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    // skip initial render when current path is empty still
    if (currentPath !== "") {
      dispatch(closeNavbar());
    }

    // console.log("location", location);
    setCurrentPath(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isAuthenticated]);

  useEffect(() => {
    // check if user is signed in as commissioner
    if (isAuthenticated) {
      const userName = user?.name ?? "";
      setIsCommissioner(userName.includes("Chipeco"));
    }
  }, [currentPath, isAuthenticated, user]);

  const expandFunction = useCallback(() => {
    toggleStandingsExpansion(!isStandingsExpanded);
  }, [toggleStandingsExpansion, isStandingsExpanded]);

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
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.DraftsHome}`}
          >
            Drafts
          </S.Link>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.TradeHistory}`}
          >
            Trade History
          </S.Link>
          <S.Link
            to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.TransactionsHistoryHome}`}
          >
            Transactions History
          </S.Link>
          <S.LinkStyle
            href="https://docs.google.com/document/d/e/2PACX-1vTIm5e2yuQH6z-_BkcbPe_5vgC2W098GkofewNtlk_pfsQiWlhJ0FU5BgKhQLp7Bw3uJXaXudl5gaBE/pub"
            target="_blank"
          >
            League Constitution
          </S.LinkStyle>
          <S.Link
            to={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.HallOfFame}`}
          >
            <FontAwesomeIcon icon="fa-reply" size="md" />
            <T.HorizontalSpacer factor={1} />
            OG Trifecta
          </S.Link>
          {isCommissioner && (
            <S.Link
              to={`${STATIC_ROUTES.DynastyHome}/${ERA_1}/${STATIC_ROUTES.CommissionerHome}`}
            >
              Commissioner Actions
            </S.Link>
          )}
        </S.LinkContainer>
        <S.VersionNumber>{`v${version}`}</S.VersionNumber>
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
        <S.Link
          to={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.HallOfFame}`}
        >
          Hall of Fame
        </S.Link>
        <S.Link
          to={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.TradeHistory}`}
        >
          Trade History
        </S.Link>
        <S.LinkStyle
          href="https://docs.google.com/document/d/e/2PACX-1vSXW_8gKkyCY1qz-2rWsUML5H3I38Hnz-K6aKvJjQoAqaqeVBnV_-mWTYxrobup6ALxPoDnKu4kbbwm/pub"
          target="_blank"
        >
          League Manual
        </S.LinkStyle>
        <S.Link to={`/`}>
          <FontAwesomeIcon icon="fa-reply" size="md" />
          <T.HorizontalSpacer factor={1} />
          3x5 Dynasty
        </S.Link>
        <S.VersionNumber>{`v${version}`}</S.VersionNumber>
      </S.LinkContainer>
    </S.OpenNavbarContainer>
  );
};
