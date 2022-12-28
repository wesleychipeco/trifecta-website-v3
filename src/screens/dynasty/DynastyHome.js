import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import { format } from "date-fns";
import { startCase } from "lodash";
import { LeagueCalendar } from "components/calendar/Calendar";
import * as S from "styles/DynastyHomeScreen.styles";

export const DynastyHome = () => {
  const { era } = useParams();
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const load = async () => {
      const leagueCalendarCollection = await returnMongoCollection(
        "leagueCalendar",
        era
      );
      const calendarEvents = await leagueCalendarCollection.find(
        {},
        { sort: { start: 1 } }
      );

      const convertedCalendarEvents = calendarEvents.map(
        ({ start, end, ...rest }) => {
          return {
            start: new Date(Date.parse(start)),
            end: new Date(Date.parse(end)),
            ...rest,
          };
        }
      );

      const leagueAnnouncementsCollection = await returnMongoCollection(
        "leagueAnnouncements",
        era
      );
      const announcements = await leagueAnnouncementsCollection.find(
        { archived: false },
        { sort: { date: 1 } }
      );

      setCalendarEvents(convertedCalendarEvents);
      setAnnouncements(announcements);
    };

    load();
  }, []);

  return (
    <S.ScreenContainer>
      {/* <h1>{`This is the dynasty home page for the "${startCase(
        era.replaceAll("-", " ")
      )}"`}</h1> */}
      <LeagueCalendar events={calendarEvents} />
      <S.AnnouncementsContainer>
        <S.AnnouncementTextContainer>
          <S.AnnouncementTitle>League</S.AnnouncementTitle>
          <S.AnnouncementTitle>Announcements</S.AnnouncementTitle>
        </S.AnnouncementTextContainer>
        <S.AnnouncementTextContainer>
          {announcements.map((ann) => {
            return (
              <S.Announcement key={ann.title}>
                <S.AnnouncementDate>
                  {format(new Date(ann.date), "M/d/yy ")}
                </S.AnnouncementDate>
                <S.AnnouncementTitleText>{ann.title}</S.AnnouncementTitleText>
              </S.Announcement>
            );
          })}
        </S.AnnouncementTextContainer>
      </S.AnnouncementsContainer>
    </S.ScreenContainer>
  );
};
