import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CLOSED_NAVBAR_WIDTH = "5rem";
export const OPEN_NAVBAR_WIDTH = "15rem";

export const ClosedBars = styled(FontAwesomeIcon).attrs({})`
  padding: 1.75rem 0 0 1.75rem;
  width: 2rem;
  height: 2rem;
  font-size: 1.75rem;
`;

export const OpenBarsContainer = styled.div`
  flex-direction: row;
  padding: 2.5rem 1rem 1rem 2.5rem;
  justify-content: center;
  align-items: center;
`;

export const CloseIcon = styled(FontAwesomeIcon).attrs({})`
  width: 2rem;
  height: 2rem;
  font-size: 2rem;
  margin-left: 2rem;
  padding: 0.5rem;

  &:hover {
    opacity: 0.5;
  }
`;

export const ClosedNavbarContainer = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 0.75rem;
  border-radius: 50%;
  background-color: red;
  width: ${CLOSED_NAVBAR_WIDTH};
  height: ${CLOSED_NAVBAR_WIDTH};

  &:hover {
    opacity: 0.6;
  }
`;

export const OpenNavbarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: green;
  width: ${OPEN_NAVBAR_WIDTH};
  height: 50rem;
`;

export const Logo = styled.img`
  width: 2.5rem;
  height: 2.5rem;
`;

export const Link = styled(NavLink)`
  display: flex;
  flex-direction: row;
  color: red;
  font-size: 1rem;
  &.active {
    color: blue;
  }
  background-color: orange;
  border-width: 1px;
  border-style: dashed;
`;
