import styled from "styled-components";
import { NavLink } from "react-router-dom";
import {
  FONT_COLOR,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";

export const Container = styled.div`
  border-radius: 3.5rem;
  background-color: ${PRIMARY_ORANGE};
  opacity: ${(props) => (props.disabled ? 0.3 : 1)};

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.3 : 0.6)};
  }
`;

export const Link = styled(NavLink)`
  display: flex;
  flex-direction: row;
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  padding: 0.8rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "cursor")};

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
    font-weight: 500;
  }
`;
