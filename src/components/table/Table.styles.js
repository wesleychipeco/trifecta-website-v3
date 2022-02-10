import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { BACKGROUND_COLOR, PRIMARY_GREEN } from "../../styles/variables";

export const Table = styled.table`
  border-radius: 1rem;
  border-spacing: 0 0.75rem;
`;

export const TableHead = styled.thead``;

export const TableHeadRow = styled.tr``;

export const TableHeaderCell = styled.th`
  font-size: 1.3rem;
  font-weight: 900;
  padding: 1.5rem 0.75rem 1.5rem 0.75rem;
  background-color: #708090;

  &:first-child {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }
  &:last-child {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }
`;

export const TableHeaderSortSpan = styled.span`
  margin-left: 1rem;
`;

export const SortIcon = styled(FontAwesomeIcon).attrs({})`
  color: ${BACKGROUND_COLOR};
  font-size: 1.5rem;
`;

export const TableBody = styled.tbody``;

export const TableBodyRow = styled.tr`
  box-shadow: 0.2rem 0.1rem rgba(169, 169, 169, 0.5);
  border-radius: 1rem;
`;

export const TableBodyCell = styled.td`
  padding: 0.75rem;
  border-style: solid;
  border-color: rgba(169, 169, 169, 0.5);
  border-width: 1px 0 1px 0;

  &:first-child {
    border-width: 1px 0 1px 1px;
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }
  &:last-child {
    border-width: 1px 1px 1px 0;
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }
`;
