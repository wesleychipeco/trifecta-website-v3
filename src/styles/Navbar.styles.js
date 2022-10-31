import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FONT_COLOR, HEADER_FONT_FAMILY, PRIMARY_GREEN } from "./variables";

////////// CLOSED NAVBAR //////////

export const CLOSED_NAVBAR_WIDTH = "5rem";

export const ClosedNavbarContainer = styled.div`
  position: fixed;
  left: 0.75rem;
  top: 0.75rem;
  border-radius: 50%;
  background-color: ${PRIMARY_GREEN};
  width: ${CLOSED_NAVBAR_WIDTH};
  height: ${CLOSED_NAVBAR_WIDTH};

  &:hover {
    opacity: 0.6;
  }
`;

export const ClosedBars = styled(FontAwesomeIcon).attrs({})`
  padding: 1.75rem 0 0 1.75rem;
  width: 2rem;
  height: 2rem;
  font-size: 1.75rem;
`;

////////// OPEN //////////
export const OPEN_NAVBAR_WIDTH = "17rem";
const OPEN_LEFT_PADDING = "1.5rem";
const NAVBAR_VERTICAL_SPACING = "1.5rem";

export const OpenNavbarContainer = styled.div`
  z-index: 999;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${PRIMARY_GREEN};
  width: ${OPEN_NAVBAR_WIDTH};
  height: 100%;
  border-radius: 0 1.5rem 1.5rem 1.5rem;
`;

export const Logo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

export const CloseIcon = styled(FontAwesomeIcon).attrs({})`
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  margin-left: 8rem;
  padding: 0.5rem;

  &:hover {
    opacity: 0.5;
  }
`;

export const HeaderContainer = styled.div`
  flex-direction: row;
  padding: 1rem 1rem ${NAVBAR_VERTICAL_SPACING} ${OPEN_LEFT_PADDING};
  justify-content: center;
  align-items: center;
`;

export const LinkContainer = styled.div`
  padding-left: ${OPEN_LEFT_PADDING};
`;

export const Link = styled(NavLink)`
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
  padding-left: 1.5rem;
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
