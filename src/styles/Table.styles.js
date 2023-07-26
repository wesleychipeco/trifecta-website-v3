import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import { BACKGROUND_COLOR, MOBILE_MAX_WIDTH, PRIMARY_ORANGE } from "./global";

export const ScrollTable = styled.div`
  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
    height: 100%;
    overflow: scroll;
  }
`;

export const Table = styled.table`
  border-radius: 1rem;
  border-spacing: 0 0.75rem;
  padding: 0;
  margin: 0 0.5rem 0 0rem;
`;

export const TableHead = styled.thead``;

export const TableHeadRow = styled.tr``;

// old TableHeaderCell background-color: #6f7378;
export const TableHeaderCell = styled.th`
  text-align: left;
  font-size: 1.3rem;
  font-weight: 500;
  padding: 1.5rem 0.75rem 1.5rem 0.75rem;
  background-color: ${PRIMARY_ORANGE};

  &:first-child {
    border-top-left-radius: 0.75rem;
    border-bottom-left-radius: 0.75rem;
  }
  &:last-child {
    border-top-right-radius: 0.75rem;
    border-bottom-right-radius: 0.75rem;
  }

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
    font-weight: 700;
    padding: 0.75rem 0.5rem 0.75rem 0.5rem;

    &:first-child {
      left: 0;
      position: sticky;
      background-color: ${PRIMARY_ORANGE};
      border-top-left-radius: 0rem;
      border-bottom-left-radius: 0rem;
    }
  }
`;

export const TableHeaderSortSpan = styled.span`
  margin-left: 1rem;
  display: flex;
  align-self: center;

  @media ${MOBILE_MAX_WIDTH} {
    margin-left: 0.5rem;
  }
`;

export const SortIcon = styled(FontAwesomeIcon).attrs({})`
  color: ${BACKGROUND_COLOR};
  font-size: 1.5rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.25rem;
  }
`;

export const TableBody = styled.tbody``;

export const TableBodyRow = styled.tr`
  box-shadow: ${(props) => {
    const box = "0.12rem 0.12rem 0.1rem 0.175rem";
    let color = "rgba(0, 0, 0, 0.9)";
    if (props.top3Styling) {
      if (props.top3Array?.[0] === props.index) {
        color = "rgba(255, 215, 0, 1)";
      } else if (props.top3Array?.[1] === props.index) {
        color = "rgba(112, 128, 144, 0.9)";
      } else if (props.top3Array?.[2] === props.index) {
        color = "rgba(205, 127, 50, 1)";
      }
    }
    return `${box} ${color};`;
  }}
  border-width: 4rem;
  border-style: solid;
  border-radius: 1rem;
  position: relative;
  margin-bottom: 2rem;

  @media ${MOBILE_MAX_WIDTH} {
    border-top-left-radius: 0rem;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
    border-bottom-left-radius: 0rem;
  }
 `;

export const TableBodyCell = styled.td`
  padding: 0.75rem;

  @media ${MOBILE_MAX_WIDTH} {
    padding: 0.5rem;

    &:first-child {
      left: 0;
      position: sticky;
      background-color: ${BACKGROUND_COLOR};
      box-shadow: inset 0rem 0rem 0.05rem 0.14rem rgba(0, 0, 0, 0.9);
    }
  }
`;
