import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { returnMongoCollection } from "database-management";
import { format, isAfter, isBefore } from "date-fns";
import { pick } from "lodash";
import { LeagueCalendar } from "components/calendar/Calendar";
import * as S from "styles/DynastyHomeScreen.styles";
import * as T from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { Table } from "components/table/Table";
import {
  Dynasty3x5DynastyPointsColumn,
  Dynasty3x5DynastyPointsInProgressColumn,
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
  const [lastUpdatedDay, setLastUpdatedDay] = useState("");

  const DynastyStandingsColumns = useMemo(
    () => [
      Dynasty3x5GmColumn,
      Dynasty3x5DynastyPointsColumn,
      Dynasty3x5DynastyPointsInProgressColumn,
    ],
    []
  );

  useEffect(() => {
    if (isReady) {
      const display = async () => {
        const collection = await returnMongoCollection("dynastyStandings", era);
        const rawData = await collection.find({});
        const data = rawData.filter(
          (doc) => doc.type !== "test" && doc.type !== "backup"
        );
        const standings = data?.[0]?.standings ?? [];
        const lastUpdated = data?.[0]?.lastUpdated ?? "";
        const lastUpdatedIndex = lastUpdated.indexOf(",");
        const lastUpdatedDay = lastUpdated.substring(0, lastUpdatedIndex);
        const dynastyPointsOnlyStandings = standings.map((team) =>
          pick(team, ["gm", "totalDynastyPoints", "totalDynastyPointsInSeason"])
        );
        setDynastyStandings(dynastyPointsOnlyStandings);
        setLastUpdatedDay(lastUpdatedDay);
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
        {},
        { sort: { startDate: -1 } }
      );
      const now = new Date();
      const inProgressAnnouncements = announcements.filter(
        (ann) =>
          isBefore(new Date(Date.parse(ann.startDate)), now) &&
          isAfter(new Date(Date.parse(ann.endDate)), now)
      );

      setCalendarEvents(convertedCalendarEvents);
      setAnnouncements(inProgressAnnouncements);
    };

    load();
  }, [era]);

  return (
    <S.ScreenContainer>
      {dynastyStandings.length > 0 && (
        <S.StandingsContainer>
          <S.StandingsTitle>Dynasty Standings</S.StandingsTitle>
          {lastUpdatedDay && (
            <>
              <G.FlexRowCentered>
                <T.LastUpdatedTime style={{ fontWeight: 800 }}>
                  Last Updated:{" "}
                </T.LastUpdatedTime>
                <G.HorizontalSpacer factor={1} />
                <T.LastUpdatedTime>{lastUpdatedDay}</T.LastUpdatedTime>
              </G.FlexRowCentered>
            </>
          )}
          <Table
            columns={DynastyStandingsColumns}
            data={dynastyStandings}
            sortBy={[{ id: "totalDynastyPointsInSeason", desc: true }]}
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
                    {format(new Date(ann.startDate), "M/d/yy ")}
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
