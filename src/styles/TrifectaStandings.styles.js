import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FONT_COLOR, HEADER_FONT_FAMILY } from "styles/global";

export const TableCaption = styled.p`
  margin: 0.5rem;
`;

export const Link = styled(NavLink)`
  display: flex;
  flex-direction: row;
  font-size: 1rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
  font-style: italic;
  &.active {
    font-weight: 700;
  }
  &:hover {
    opacity: 0.6;
  }
`;
