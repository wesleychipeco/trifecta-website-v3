import styled from "styled-components";
import { FONT_COLOR, HEADER_FONT_FAMILY } from "./variables";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

export const OwnerName = styled.div`
  font-size: 1.75rem;
  text-decoration: none;
  font-family: ${HEADER_FONT_FAMILY};
  color: ${FONT_COLOR};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1rem;
`;

export const Spacer = styled.div`
  margin-top: 1rem;
`;
