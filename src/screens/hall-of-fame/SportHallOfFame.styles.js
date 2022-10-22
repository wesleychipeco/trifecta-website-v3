import styled from "styled-components";
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
  margin: 0.25rem 0 0 0;
`;

export const StringTableHeaderCell = styled(TableHeaderCell)`
  width: 12rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
`;

export const NumbersTableHeaderCell = styled(TableHeaderCell)`
  width: 3rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
`;

export const TablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SingleTableContainer = styled(FlexColumnCenterContainer)`
  margin-bottom: 4rem;
`;

export const TwoTablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4rem;
`;

export const LeftTableContainer = styled(TablesContainer)`
  margin-right: 3rem;
`;
