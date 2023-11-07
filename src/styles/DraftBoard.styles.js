import styled from "styled-components";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";
import { MOBILE_MAX_WIDTH, TITLE_FONT_SIZE } from "./global";
import { NUMBER_OF_TEAMS } from "Constants";
import { determineBackgroundColor } from "./DraftCardColors";

export const DraftsHomeContainer = styled.div`
  width: 85%;
  margin-top: 2rem;
`;

export const DraftsHomeRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 2rem 0 3rem 0;
`;

export const DraftsHeader = styled.h2`
  margin: 0;
  font-size: 2rem;
  text-align: center;
  text-decoration: underline;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.25rem;
    text-align: center;
    width: 16rem;
    align-self: center;
  }
`;

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

const ColumnWidth = styled.div`
  width: calc(100% / ${NUMBER_OF_TEAMS});
  justify-content: center;
  min-width: 0;
`;

export const ColumnWidthColumn = styled(ColumnWidth)`
  flex-direction: column;
`;

export const ColumnWidthRow = styled(ColumnWidth)`
  flex-direction: row;
`;

export const HeaderRow = styled(ColumnWidthRow)`
  background-color: ${(props) => determineBackgroundColor(props)};
  outline: 1px solid;
`;

export const GridPickContainer = styled(ColumnWidth)`
  flex-direction: row;
  background-color: ${(props) => determineBackgroundColor(props)};
`;

export const PickPickContainer = styled(FlexColumnCenterContainer)`
  outline: 1px solid;
  width: 100%;
  background-color: ${(props) => determineBackgroundColor(props)};
`;

export const TeamHeaderText = styled.h3`
  margin: 0.3rem 0 0.3rem 0;
  padding: 0;
  font-size: 1rem;
  text-align: center;
`;
