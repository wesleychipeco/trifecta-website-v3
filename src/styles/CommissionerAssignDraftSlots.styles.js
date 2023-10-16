import styled from "styled-components";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";
import {
  FONT_COLOR,
  FONT_FAMILY,
  HEADER_FONT_FAMILY,
  MOBILE_MAX_WIDTH,
  PRIMARY_ORANGE,
  TITLE_FONT_SIZE,
} from "./global";

export const CommissionerAssignDraftSlotsRowContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 2rem;
`;

export const CommissionerAssignDraftSlotsEachRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 2rem;
  width: 50%;
  justify-content: space-between;
`;

export const CommissionerAssignDraftSlotsText = styled.h4`
  margin: 0;
  padding: 0 0 0 3rem;
  font-size: 1.5rem;
  font-weight: 500;
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
