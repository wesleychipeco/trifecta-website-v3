import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  getYear,
  getMonth,
  getDaysInMonth,
  isAfter,
} from "date-fns";
import "./Calendar.css";
import * as S from "styles/Calendar.styles";

const locales = {
  "en-US": require("date-fns"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export const LeagueCalendar = ({ events }) => {
  const now = new Date();
  const firstYear = getYear(now);
  const firstMonth = getMonth(now);

  const upcomingEvents = events.filter((event) => isAfter(event.start, now));
  const next8UpcomingEvents = upcomingEvents.slice(0, 8);
  return (
    <S.OuterContainer>
      <Calendar
        events={events}
        localizer={localizer}
        defaultDate={new Date(firstYear, firstMonth, 1)}
        max={new Date(firstYear, firstMonth, getDaysInMonth(now))}
        views={["month"]}
        style={{ height: 600, width: "65%", paddingRight: "1rem" }}
        tooltipAccessor="description"
      />
      <S.UpcomingEventsMainContainer>
        <S.UpcomingEventsOuterContainer>
          <S.UpcomingEventsTitle>Upcoming League Events</S.UpcomingEventsTitle>
          {next8UpcomingEvents.map((event) => {
            const formattedDateTime = format(event.start, "E MMM d h:mma");
            return (
              <S.UpcomingEventsInnerContainer key={event.start}>
                <S.DateContainer>
                  <S.EventText>{formattedDateTime}</S.EventText>
                </S.DateContainer>
                <S.EventContainer>
                  <S.EventText>{event.title}</S.EventText>
                </S.EventContainer>
              </S.UpcomingEventsInnerContainer>
            );
          })}
        </S.UpcomingEventsOuterContainer>
      </S.UpcomingEventsMainContainer>
    </S.OuterContainer>
  );
};
