import styled from "styled-components";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
} from "./global";

export const CommissionerInitializeSupplementaryDraftPicksRowContainer = styled.div`
  width: 25%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 1rem;
  justify-content: space-between;
`;

export const CommissionerInitializeSupplementaryDraftPicksText = styled.h4`
  margin: 0;
  padding: 2rem 0 0 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const ManualInput = styled.input`
  width: 50%;
  height: 2rem;
  font-size: 1.15rem;
  font-family: ${FONT_FAMILY};
  text-align: left;

  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;
  outline: none;
  border: 3px solid black;

  &:focus {
    border: 3px solid ${PRIMARY_ORANGE};
  }

  @media ${MOBILE_MAX_WIDTH} {
    padding: 0.25rem;
    width: 16rem;
    height: 1.25rem;
    font-size: 1rem;
    border: 2px solid black;
    text-align: center;
  }
`;

export const SaveButton = styled.button`
  margin: 0;
  padding: 0;
  width: 8rem;
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

export const SaveMessageText = styled.p`
  margin: 0;
  padding: 0;
  font-size: 1.2rem;
  font-style: italic;

  @media ${MOBILE_MAX_WIDTH} {
    position: static;
    align-self: center;
  }
`;
