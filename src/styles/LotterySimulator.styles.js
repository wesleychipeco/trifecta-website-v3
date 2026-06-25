import styled from "styled-components";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const LotterySimulatorContainer = styled.div`
  width: 90%;
`;

export const LotterySimulatorColumns = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  gap: 10rem;
  margin-top: 3rem;
`;

export const LotterySimulatorColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const LotterySimulatorSimButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

export const SimLotteryButton = styled.button`
  margin: 0;
  padding: 0;
  width: 12rem;
  height: 3rem;
  background-color: ${PRIMARY_ORANGE};
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

export const LotteryTableTable = styled.table`
  width: 30rem;
  margin-top: 2rem;

  tr > td {
    text-align: center;
  }
`;

export const LotteryTableHeaderText = styled.th`
  font-size: 1.25rem;
  font-weight: 900;
`;

export const LotteryTableNameInput = styled.input`
  font-family: ${FONT_FAMILY};
  font-size: 1rem;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  outline: none;
  border: 3px solid black;
  margin-left: 1rem;

  &:focus {
    border: 3px solid ${PRIMARY_ORANGE};
  }

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 0.75rem;
    text-align: center;
    margin-right: 0rem;
    margin-bottom: 0.5rem;
  }
`;

export const LotteryTableChancesInput = styled(LotteryTableNameInput)`
  width: 2.25rem;
  margin-left: 0;
  text-align: center;
`;

export const LotteryTableCell = styled.td`
  padding: 0.5rem;

  background-color: ${(props) =>
    props.shouldHighlight ? "green" : "transparent"};
  font-weight: ${(props) => (props.shouldHighlight ? "bold" : "normal")};
`;

export const LotteryTableClearTeamButton = styled(FontAwesomeIcon)`
  &:hover {
    opacity: 0.6;
    cursor: pointer;
  }
`;

export const LotteryResultsColumn = styled(LotterySimulatorColumn)`
  overflow: hidden;
  width: ${({ visible }) =>
    visible ? "40rem" : "0"}; /* or whatever width fits */
  opacity: ${({ visible }) => (visible ? "1" : "0")};
  transition:
    width 5s ease,
    opacity 5s ease;
`;

export const LotteryResultsText = styled.p`
  font-size: ${({ index, total }) => 0.125 * (total - index) + 1.2}rem;
  margin: 1rem 0 1rem 0;
  padding: 0;
  font-style: italic;

  opacity: 0;
  animation: fadeIn 0.4s ease forwards;
  animation-delay: ${({ index, total }) => (total - 1 - index) * 1.75 + 2.5}s;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(0);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const Shoutout = styled.div`
  position: absolute;
  bottom: 4%;
`;

export const ShoutoutText = styled.p`
  font-size: 1rem;
`;
