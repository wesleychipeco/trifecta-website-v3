import styled from "styled-components";
import { MOBILE_MAX_WIDTH } from "./global";

export const OuterContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media ${MOBILE_MAX_WIDTH} {
    flex-direction: column;
  }
`;

export const OuterCalendarContainer = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
`;

export const CalendarContainer = styled.div`
  display: grid;
  row-gap: 10rem;
`;

export const UpcomingEventsTitle = styled.h2`
  margin: 0 0 1rem 0;
  padding: 0;
  font-size: 2rem;
  align-self: center;
`;

export const DateContainer = styled.div`
  width: 65%;
`;

export const EventContainer = styled.div`
  width: 100%;
`;

export const EventText = styled.p`
  margin: 0.75rem 0 0.75rem 0;
  padding: 0;
  font-size: 1.5rem;
`;

export const UpcomingEventsMainContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

export const UpcomingEventsOuterContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

export const UpcomingEventsInnerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: start;
`;
