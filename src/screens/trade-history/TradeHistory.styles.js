import styled from "styled-components";
import {
  TableHeaderCell,
  TableBodyCell,
} from "../../components/table/Table.styles";
import { FONT_FAMILY, PRIMARY_GREEN } from "../../styles/variables";

export const Container = styled.div`
  padding: 0 2rem 0 2rem;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
`;

export const InputContainer = styled.div`
  display: flex;
  margin-bottom: 1rem;
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
    border: 3px solid ${PRIMARY_GREEN};
  }
`;

export const HeaderText = styled.p`
  margin: 0;
  padding: 0;
`;

export const DateTableHeaderCell = styled(TableHeaderCell)`
  width: 6rem;

  &:hover ${HeaderText} {
    opacity: 0.7;
  }
`;

export const OwnersTableHeaderCell = styled(TableHeaderCell)`
  width: 10rem;
`;

export const PlayersTableHeaderCell = styled(TableHeaderCell)`
  width: 15rem;
`;

export const TradeHistoryTableBodyCell = styled(TableBodyCell)`
  line-height: 1.5rem;
`;
