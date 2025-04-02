import styled from "styled-components";
import { TableHeaderCell } from "./Table.styles";
import { MOBILE_MAX_WIDTH, TITLE_FONT_SIZE } from "./global";
import { MOBILE_NAVBAR_BODY_PADDING } from "App.styles";

export const FlexColumnCenterContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 2rem);
  padding-right: 2rem;
  justify-content: center;
  align-items: center;

  @media ${MOBILE_MAX_WIDTH} {
    width: calc(100% - ${MOBILE_NAVBAR_BODY_PADDING});
    padding-right: ${MOBILE_NAVBAR_BODY_PADDING};
  }
`;

export const Title = styled.h1`
  font-size: ${TITLE_FONT_SIZE};
  margin: 1rem 0 0.5rem 0;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.7rem;
    text-align: center;
    width: 15rem;
  }
`;

export const TableTitle = styled.h2`
  margin: 0;
  font-size: 1.7rem;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1.25rem;
    text-align: center;
    width: 16rem;
    align-self: center;
  }
`;

export const TableCaption = styled.p`
  font-size: 1.35rem;
  margin: 0.25rem 0 0 0;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
    margin: 0;
    text-align: center;
    align-self: center;
  }
`;

export const LastUpdatedTime = styled.p`
  font-size: 1.35rem;
  margin: 0.25rem 0 0 0;

  @media ${MOBILE_MAX_WIDTH} {
    font-size: 1rem;
    margin: 0;
    text-align: center;
    align-self: center;
  }
`;

export const StringTableHeaderCell = styled(TableHeaderCell)`
  width: 12rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 10rem;
    padding: 0.5rem;
  }
`;

export const NumbersTableHeaderCell = styled(TableHeaderCell)`
  width: 3rem;
  padding: 0.5rem 0.75rem 0.5rem 0.75rem;

  @media ${MOBILE_MAX_WIDTH} {
    width: 4rem;
    padding: 0.5rem;
  }
`;

export const NumberCenteredTableHeaderCell = styled(NumbersTableHeaderCell)`
  text-align: center;
`;

export const TablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media ${MOBILE_MAX_WIDTH} {
    width: 100%;
    align-items: flex-start;
  }
`;

export const SingleTableContainer = styled(FlexColumnCenterContainer)`
  margin-bottom: 4rem;

  @media ${MOBILE_MAX_WIDTH} {
    margin-bottom: 1rem;
    align-items: flex-start;
    width: 100%;
  }
`;

export const TwoTablesContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 4rem;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
    margin-bottom: 1rem;
    align-items: flex-start;
    width: 100%;
  }
`;

export const LeftTableContainer = styled(TablesContainer)`
  margin-right: 3rem;

  @media ${MOBILE_MAX_WIDTH} {
    margin-right: 0;
  }
`;
