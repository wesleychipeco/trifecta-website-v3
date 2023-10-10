import styled from "styled-components";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";
import { MOBILE_MAX_WIDTH, TITLE_FONT_SIZE } from "./global";

export const FlexColumnCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  padding-right: 0rem;
  justify-content: center;

  @media ${MOBILE_MAX_WIDTH} {
    width: calc(100% - ${MOBILE_NAVBAR_BODY_PADDING});
    padding-right: ${MOBILE_NAVBAR_BODY_PADDING};
  }
`;

export const Title = styled.h1`
  font-size: ${TITLE_FONT_SIZE};
  margin: 1rem 0 0 0;
  text-align: center;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.7rem;
    text-align: center;
    width: 15rem;
  }
`;

export const FlexRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 0;
`;

export const FlexColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const EachColumn = styled.div`
  flex-direction: row;
  width: calc(100% / 16);
  justify-content: center;
  border: 1px solid;
  min-width: 0;
`;

export const TeamHeaderText = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1rem;
  text-align: center;
`;
