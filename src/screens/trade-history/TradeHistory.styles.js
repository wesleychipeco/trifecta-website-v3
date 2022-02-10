import styled from "styled-components";
import {
  TableHeaderCell,
  TableBodyCell,
} from "../../components/table/Table.styles";

export const Container = styled.div`
  padding: 0 2rem 0 2rem;
`;

export const DateTableHeaderCell = styled(TableHeaderCell)`
  text-align: left;
  width: 6rem;
`;

export const OwnersTableHeaderCell = styled(TableHeaderCell)`
  text-align: left;
  width: 10rem;
`;

export const PlayersTableHeaderCell = styled(TableHeaderCell)`
  text-align: left;
  width: 15rem;
`;

export const TradeHistoryTableBodyCell = styled(TableBodyCell)`
  line-height: 1.5rem;
`;
