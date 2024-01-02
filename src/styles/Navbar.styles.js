import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FONT_COLOR,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";

////////// CLOSED NAVBAR //////////

export const CLOSED_NAVBAR_WIDTH = "5rem";
export const CLOSED_NAVBAR_MOBILE_WIDTH = "3.5rem";

export const ClosedNavbarContainer = styled.div`
  position: fixed;
  left: 0.75rem;
  top: 0.75rem;
  border-radius: 50%;
  background-color: ${PRIMARY_ORANGE};
  width: ${CLOSED_NAVBAR_WIDTH};
  height: ${CLOSED_NAVBAR_WIDTH};
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${PRIMARY_ORANGE}99;
    cursor: pointer;
  }

  @media ${MOBILE_MAX_WIDTH} {
    position: absolute;
    left: 0.5rem;
    top: 0.5rem;

    width: ${CLOSED_NAVBAR_MOBILE_WIDTH};
    height: ${CLOSED_NAVBAR_MOBILE_WIDTH};
  }
`;

export const TrifectaSymbol = styled.img`
  width: 4rem;
  height: 4rem;
  padding-top: 0.2rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 2.8rem;
    height: 2.8rem;
  }
`;

export const ClosedBars = styled(FontAwesomeIcon).attrs({})`
  padding: 1.5rem 0 0 1.5rem;
  width: 2rem;
  height: 2rem;
  font-size: 1.75rem;
`;

////////// OPEN //////////
export const OPEN_NAVBAR_WIDTH = "22rem";
export const MOBILE_OPEN_NAVBAR_WIDTH = "100vw";
const OPEN_LEFT_PADDING = "1.5rem";
const NAVBAR_VERTICAL_SPACING = "1.5rem";

export const OpenNavbarContainer = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${PRIMARY_ORANGE};
  width: ${OPEN_NAVBAR_WIDTH};
  height: 100%;
  border-radius: 0 1.5rem 1.5rem 0;

  @media ${MOBILE_MAX_WIDTH} {
    width: ${MOBILE_OPEN_NAVBAR_WIDTH};
    border-radius: 0;
  }
`;

export const Logo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

export const HorizontalLogo = styled.img`
  width: 100%;
  height: 100%;
`;

export const SecondRowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  margin-top: 0rem;
  padding-top: 0rem;
`;

export const CloseIcon = styled(FontAwesomeIcon).attrs({})`
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  padding: 0 0.5rem 0 0.5rem;
  align-self: flex-end;

  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.75rem 0 0.75rem;
`;

export const LinkContainer = styled.div`
  padding-left: ${OPEN_LEFT_PADDING};
`;

export const WelcomeText = styled.p`
  font-size: 1.4rem;
  text-decoration: none;
  font-style: italic;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  font-weight: 500;
  padding: 0;
  margin: 0;
  text-align: center;
`;

export const LogoLink = styled(NavLink)`
  margin 0;
  padding 0;

  &:hover {
    opacity: 0.6;
  }
`;

export const Link = styled(NavLink)`
  display: flex;
  flex-direction: row;
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  margin-bottom: ${NAVBAR_VERTICAL_SPACING};
  align-items: center;

  &.active {
    font-weight: 700;
  }
  &:hover {
    opacity: 0.6;
  }
`;

export const LinkStyle = styled.a`
  display: flex;
  flex-direction: row;
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  margin-bottom: ${NAVBAR_VERTICAL_SPACING};

  &.active {
    font-weight: 700;
  }
  &:hover {
    opacity: 0.6;
  }
`;

export const IndentedLink = styled(Link)`
  font-size: 1.75rem;
  padding-left: 1.75rem;
`;

export const BottomLink = styled(Link)`
  position: absolute;
  bottom: 0;
`;

export const CurrentStandings = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  margin-bottom: ${NAVBAR_VERTICAL_SPACING};

  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;

export const VersionNumber = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1rem;

  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
`;
