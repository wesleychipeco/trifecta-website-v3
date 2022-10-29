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
  margin-bottom: 1rem;
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
  width: 6rem;
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

export const LeftContainer = styled.div`
  position: absolute;
  left: 12rem;
  display: flex;
  flex-direction: column;
`;

export const DropdownContianer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Subtitle = styled.p`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
`;

export const DropdownLabel = styled.p`
  margin: 0 0.75rem 0 0;
  font-size: 1.25rem;
`;
