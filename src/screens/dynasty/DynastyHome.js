import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { returnMongoCollection } from "database-management";
import { startCase } from "lodash";
import { LeagueCalendar } from "components/calendar/Calendar";

export const DynastyHome = () => {
  const { era } = useParams();
  const [gms, setGMs] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("gms", era);
      const data = await collection.find({});
      setGMs(data);

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
      setCalendarEvents(convertedCalendarEvents);
    };

    load();
  }, []);

  return (
    <div>
      <h1>{`This is the dynasty home page for the "${startCase(
        era.replaceAll("-", " ")
      )}"`}</h1>
      <h2>League Calendar here</h2>
      <LeagueCalendar events={calendarEvents} />
      <h2>3x5 Standings here</h2>
      <h2>GMs just for testing</h2>
      {gms.map((eachGM) => (
        <div key={eachGM.name}>
          <p>{`Name: ${eachGM.name}`}</p>
          <p>{`Team Letter: ${eachGM.letter}`}</p>
        </div>
      ))}
    </div>
  );
};
