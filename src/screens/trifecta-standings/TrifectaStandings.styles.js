import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { FONT_COLOR, HEADER_FONT_FAMILY } from "../../styles/variables";
import { TableHeaderCell } from "../../components/table/Table.styles";

export const FlexColumnCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  padding-right: 2rem;
  justify-content: center;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 3rem;
`;

export const TableTitle = styled.h2`
  margin: 0;
`;

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

export const StringTableHeaderCell = styled(TableHeaderCell)`
  width: 9rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
`;

export const NumbersTableHeaderCell = styled(TableHeaderCell)`
  width: 3rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
`;

export const TablesContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SingleTableContainer = styled(FlexColumnCenterContainer)`
  margin-bottom: 4rem;
`;

export const TwoTablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4rem;
`;

export const LeftTableContainer = styled.div`
  margin-right: 3rem;
`;