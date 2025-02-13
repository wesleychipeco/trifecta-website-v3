import styled from "styled-components";
import { FONT_FAMILY, MOBILE_MAX_WIDTH, PRIMARY_ORANGE } from "styles/global";
import { TablesContainer as TC } from "./StandardScreen.styles";

export const TablesContainer = styled(TC)`
  width: 103%;
`;

export const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
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
    margin-right: 0rem;
    margin-bottom: 0.5rem;
  }
`;

export const HeaderText = styled.p`
  margin: 0;
  padding: 0;
`;

export const TotalsCaption = styled.p`
  font-size: 1.25rem;
  padding: 0;
  margin: 0;
`;
