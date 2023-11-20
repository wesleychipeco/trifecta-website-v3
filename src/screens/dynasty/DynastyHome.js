import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { returnMongoCollection } from "database-management";
import { format } from "date-fns";
import { pick } from "lodash";
import { LeagueCalendar } from "components/calendar/Calendar";
import * as S from "styles/DynastyHomeScreen.styles";
import { Table } from "components/table/Table";
import {
  Dynasty3x5DynastyPointsColumn,
  Dynasty3x5GmColumn,
} from "./standings/StandingsColumns";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const DynastyHome = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);

  const [dynastyStandings, setDynastyStandings] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const DynastyStandingsColumns = useMemo(
    () => [Dynasty3x5GmColumn, Dynasty3x5DynastyPointsColumn],
    []
  );

  useEffect(() => {
    if (isReady) {
      const display = async () => {
        const collection = await returnMongoCollection("dynastyStandings", era);
        const data = await collection.find({});
        const standings = data?.[0]?.standings ?? [];
        const dynastyPointsOnlyStandings = standings.map((team) =>
          pick(team, ["gm", "totalDynastyPoints"])
        );
        setDynastyStandings(dynastyPointsOnlyStandings);
      };
      display();
    }
  }, [isReady, era]);

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
  }, [era]);

  return (
    <S.ScreenContainer>
      {dynastyStandings.length > 0 && (
        <S.StandingsContainer>
          <S.StandingsTitle>Dynasty Standings</S.StandingsTitle>
          <Table
            columns={DynastyStandingsColumns}
            data={dynastyStandings}
            sortBy={[{ id: "totalDynastyPoints", desc: true }]}
            top3Styling
            scrollTableHeight={isMobile && "28rem"}
          />
        </S.StandingsContainer>
      )}
      <S.InformationContainer>
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
      </S.InformationContainer>
    </S.ScreenContainer>
  );
};
