import styled from "styled-components";
import { FONT_COLOR, HEADER_FONT_FAMILY, MOBILE_MAX_WIDTH } from "./global";

export const LotterySimulatorContainer = styled.div`
  width: 90%;
`;

export const LotterySimulatorColumns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  gap: 5rem;
  margin-top: 3rem;
`;

export const LotterySimulatorColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background-color: green;
  width: 100%;
`;

export const LotterySimulatorSimButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SimLotteryButton = styled.button`
  margin: 0;
  padding: 0;
  width: 12rem;
  height: 3rem;
  background-color: blue;
  border-radius: 5rem;
  border: 0;

  font-size: 1.4rem;
  font-family: ${HEADER_FONT_FAMILY};
  font-weight: 700;
  color: ${FONT_COLOR};
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }

  &:disabled {
    background-color: gray;
    opacity: 0.6;
  }

  @media ${MOBILE_MAX_WIDTH} {
    width: 4rem;
    height: 2rem;

    font-size: 1rem;
    font-weight: 700;
  }
`;
