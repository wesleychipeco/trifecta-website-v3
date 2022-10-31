import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { BACKGROUND_COLOR } from "./variables";

export const Table = styled.table`
  border-radius: 1rem;
  border-spacing: 0 0.75rem;
`;

export const TableHead = styled.thead``;

export const TableHeadRow = styled.tr``;

export const TableHeaderCell = styled.th`
  text-align: left;
  font-size: 1.3rem;
  font-weight: 500;
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
  display: flex;
  align-self: center;
`;

export const SortIcon = styled(FontAwesomeIcon).attrs({})`
  color: ${BACKGROUND_COLOR};
  font-size: 1.5rem;
`;

export const TableBody = styled.tbody``;

export const TableBodyRow = styled.tr`
  box-shadow: ${(props) => {
    if (props.top3Styling) {
      const box = "0.12rem 0.12rem 0.1rem 0.175rem";
      let color = "rgba(169, 169, 169, 0.5)";
      if (props.top3Array?.[0] === props.index) {
        color = "rgba(255, 215, 0, 1)";
      } else if (props.top3Array?.[1] === props.index) {
        color = "rgba(225, 225, 225, 1)";
      } else if (props.top3Array?.[2] === props.index) {
        color = "rgba(255, 87, 51, 1)";
      }
      return `${box} ${color};`;
    }
    return "0.12rem 0.12rem 0.1rem 0.175rem rgba(169, 169, 169, 0.5);";
  }}
  border-radius: 1rem;
  position: relative;
  margin-bottom: 2rem;
 `;

export const TableBodyCell = styled.td`
  padding: 0.75rem;
`;
