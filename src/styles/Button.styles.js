import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FONT_COLOR, HEADER_FONT_FAMILY, PRIMARY_GREEN } from "./variables";

export const Container = styled.div`
  border-radius: 3.5rem;
  background-color: ${PRIMARY_GREEN};

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
  padding: 0.8rem;
`;
