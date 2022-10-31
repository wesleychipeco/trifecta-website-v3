import styled from "styled-components";
import {
  Title as StandardTitle,
  NumbersTableHeaderCell as StandardNumbersTableHeaderCell,
} from "./StandardScreen.styles";

export const Title = styled(StandardTitle)`
  margin-bottom: 1rem;
`;

export const NumbersTableHeaderCell = styled(StandardNumbersTableHeaderCell)`
  width: 6rem;
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
