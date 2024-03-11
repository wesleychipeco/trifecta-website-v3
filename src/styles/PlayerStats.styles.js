import styled from "styled-components";
import { TableHeaderCell, TableBodyCell } from "styles/Table.styles";
import {
  FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  MOBILE_TITLE_FONT_SIZE,
  PRIMARY_ORANGE,
  TITLE_FONT_SIZE,
} from "styles/global";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
    flex-direction: row;
    justify-content: space-evenly;
    margin-bottom: 0.25rem;
  }
`;

export const TextInput = styled.input`
  font-family: ${FONT_FAMILY};
  font-size: 1.25rem;
  border-radius: 0.75rem;
  margin-right: 5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  outline: none;
  border: 3px solid black;

  &:focus {
    border: 3px solid ${PRIMARY_ORANGE};
  }

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 0.75rem;
    text-align: center;
    width: 7.5rem;
    margin: 0;
  }
`;

export const HeaderText = styled.p`
  margin: 0;
  padding: 0;
`;
