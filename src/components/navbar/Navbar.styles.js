import styled from "styled-components";
import { NavLink } from "react-router-dom";

export const NAVBAR_WIDTH = "10rem";

export const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  background-color: green;
  width: ${NAVBAR_WIDTH};
  height: 5rem;
`;

export const Link = styled(NavLink)`
  color: red;
  font-size: 1rem;
  &.active {
    color: blue;
  }
`;
