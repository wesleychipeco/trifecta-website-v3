import styled from "styled-components";
import {
  Title as StandardTitle,
  NumbersTableHeaderCell as StandardNumbersTableHeaderCell,
} from "./StandardScreen.styles";
import { MOBILE_MAX_WIDTH } from "./global";

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

  @media ${MOBILE_MAX_WIDTH} {
    position: static;
    left: 0rem;
    margin-bottom: 1rem;
    align-items: center;
    width: 100%;
  }
`;

export const DropdownContianer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Subtitle = styled.p`
  margin: 0 0 1rem 0;
  font-size: 1.25rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
  }
`;

export const DropdownLabel = styled.p`
  margin: 0 0.75rem 0 0;
  font-size: 1.25rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
  }
`;
