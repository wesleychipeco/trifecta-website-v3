import axios from "axios";
import { returnMongoCollection } from "database-management";
import React, { useEffect, useState } from "react";
import { sum, uniqBy } from "lodash";

import { useSelector } from "react-redux";
import * as S from "styles/CompileMatchups.styles";
import * as T from "styles/StandardScreen.styles";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const CompileMatchups = () => {
  const { currentYear } = useSelector(
    (state) => state?.currentVariables?.seasonVariables
  );

  const [teamNumbersObject, setTeamNumbersObject] = useState({});
  const [matchupsGlobalObject, setMatchupsGlobalObject] = useState({});

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("teamNumbersPerSport");
      const data = await collection.find({ year: currentYear });
      const teamNumbersObject = data?.[0];
      setTeamNumbersObject(teamNumbersObject);

      const mgo = createMatchupsGlobalObject(teamNumbersObject);
      setMatchupsGlobalObject(mgo);
    };

    load();
  }, [currentYear]);

  const createMatchupsGlobalObject = (teamNumbersObject) => {
    const matchupsGlobalObject = {};

    for (let i = 0; i < SPORTS_ARRAY.length; i++) {
      const sportMatchupsObject = {};
      const sport = SPORTS_ARRAY[i];

      const sportTeamNumbers = teamNumbersObject[sport];
      //   console.log("try", sport, sportTeamNumbers);

      // create inner object that will be same for each
      const everyOwnerMatchupsObject = {};
      for (let j = 1; j <= Object.keys(sportTeamNumbers).length; j++) {
        const eachOwnerMatchupsObject = {
          ownerNames: sportTeamNumbers[j].ownerNames,
          wins: 0,
          losses: 0,
          ties: 0,
        };
        if (sport === "football") {
          eachOwnerMatchupsObject.pointsFor = 0;
          eachOwnerMatchupsObject.pointsAgainst = 0;
        }

        everyOwnerMatchupsObject[j] = {
          ...JSON.parse(JSON.stringify(eachOwnerMatchupsObject)),
        };
      }

      for (let k = 1; k <= Object.keys(sportTeamNumbers).length; k++) {
        sportMatchupsObject[k] = {
          ownerNames: sportTeamNumbers[k].ownerNames,
          ...JSON.parse(JSON.stringify(everyOwnerMatchupsObject)), // create deep copy
        };
      }
      //   console.log("sport", sportMatchupsObject);
      matchupsGlobalObject[sport] = sportMatchupsObject;
    }
    return matchupsGlobalObject;
  };

  const determineSport = (urlArrayIndex) => {
    switch (urlArrayIndex) {
      case 0:
        return "basketball";
      case 1:
        return "baseball";
      case 2:
        return "football";
    }
  };

  const getMatchupResults = (sport, matchup) => {
    const homeTeamId = matchup.home.teamId;
    const awayTeamId = matchup.away.teamId;
    let homeWins = 0,
      homeLosses = 0,
      homeTies = 0,
      homeTotalPoints = 0,
      awayWins = 0,
      awayLosses = 0,
      awayTies = 0,
      awayTotalPoints = 0;

    if (sport === "football") {
      homeTotalPoints = matchup.home.totalPoints;
      awayTotalPoints = matchup.away.totalPoints;

      if (homeTotalPoints > awayTotalPoints) {
        homeWins = 1;
        awayLosses = 1;
      } else if (homeTotalPoints < awayTotalPoints) {
        homeLosses = 1;
        awayWins = 1;
      } else {
        homeTies = 1;
        awayTies = 1;
      }
    } else {
      homeWins = matchup.home.cumulativeScore.wins;
      homeLosses = matchup.home.cumulativeScore.losses;
      homeTies = matchup.home.cumulativeScore.ties;

      awayWins = matchup.away.cumulativeScore.wins;
      awayLosses = matchup.away.cumulativeScore.losses;
      awayTies = matchup.away.cumulativeScore.ties;
    }

    return {
      homeTeamId,
      homeWins,
      homeLosses,
      homeTies,
      homeTotalPoints,
      awayTeamId,
      awayWins,
      awayLosses,
      awayTies,
      awayTotalPoints,
    };
  };

  const startScrape = async () => {
    if (Object.keys(matchupsGlobalObject) === 0) {
      // do not run
      return;
    }
    console.log("start", matchupsGlobalObject);

    const BASKETBALL_URL = `https://fantasy.espn.com/apis/v3/games/fba/seasons/${currentYear}/segments/0/leagues/100660?view=mMatchupScore`;
    const BASEBALL_URL = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${currentYear}/segments/0/leagues/109364?view=mMatchupScore`;
    const FOOTBALL_URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/154802?view=mMatchupScore`;

    const urlsArray = [BASKETBALL_URL, BASEBALL_URL, FOOTBALL_URL];

    for (let i = 0; i < urlsArray.length; i++) {
      const sport = determineSport(i);
      const sportUrl = urlsArray[i];
      const response = await axios.get(sportUrl);
      const schedule = response?.data?.schedule ?? [];

      const matchupPeriodIdsArray = [];

      for (let j = 0; j < schedule.length; j++) {
        const matchup = schedule[j];
        // console.log("matchup", matchup);

        if (matchup.playoffTierType !== "NONE") {
          break;
        }
        matchupPeriodIdsArray.push(matchup.matchupPeriodId);

        const {
          homeTeamId,
          homeWins,
          homeLosses,
          homeTies,
          homeTotalPoints,
          awayTeamId,
          awayWins,
          awayLosses,
          awayTies,
          awayTotalPoints,
        } = getMatchupResults(sport, matchup);

        // add to matchupsGlobalObject twice, once as home team as primary and away team as secondary and vice versa
        // first iteration
        matchupsGlobalObject[sport][homeTeamId][awayTeamId].wins =
          matchupsGlobalObject[sport][homeTeamId][awayTeamId].wins + homeWins;
        matchupsGlobalObject[sport][homeTeamId][awayTeamId].losses =
          matchupsGlobalObject[sport][homeTeamId][awayTeamId].losses +
          homeLosses;
        matchupsGlobalObject[sport][homeTeamId][awayTeamId].ties =
          matchupsGlobalObject[sport][homeTeamId][awayTeamId].ties + homeTies;
        if (sport === "football") {
          matchupsGlobalObject[sport][homeTeamId][awayTeamId].pointsFor =
            matchupsGlobalObject[sport][homeTeamId][awayTeamId].pointsFor +
            homeTotalPoints;
          matchupsGlobalObject[sport][homeTeamId][awayTeamId].pointsAgainst =
            matchupsGlobalObject[sport][homeTeamId][awayTeamId].pointsAgainst +
            awayTotalPoints;
        }

        // second iteration
        matchupsGlobalObject[sport][awayTeamId][homeTeamId].wins =
          matchupsGlobalObject[sport][awayTeamId][homeTeamId].wins + awayWins;
        matchupsGlobalObject[sport][awayTeamId][homeTeamId].losses =
          matchupsGlobalObject[sport][awayTeamId][homeTeamId].losses +
          awayLosses;
        matchupsGlobalObject[sport][awayTeamId][homeTeamId].ties =
          matchupsGlobalObject[sport][awayTeamId][homeTeamId].ties + awayTies;
        if (sport === "football") {
          matchupsGlobalObject[sport][awayTeamId][homeTeamId].pointsFor =
            matchupsGlobalObject[sport][awayTeamId][homeTeamId].pointsFor +
            awayTotalPoints;
          matchupsGlobalObject[sport][awayTeamId][homeTeamId].pointsAgainst =
            matchupsGlobalObject[sport][awayTeamId][homeTeamId].pointsAgainst +
            homeTotalPoints;
        }
      }

      const actualSum = sum(matchupPeriodIdsArray);
      const expectedSum = sum(uniqBy(matchupPeriodIdsArray)) * 5;
      if (actualSum !== expectedSum) {
        console.log("UNEXPECTED NUMBER OF MATCHUPS!!!");
        return;
      }
    }
    setMatchupsGlobalObject(matchupsGlobalObject);
    // make new button for verifying fully scraped matchups
    // make new function that aggregates all of the matchups and saves to mongoDB
  };

  console.log("here", matchupsGlobalObject);
  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Compile Matchups Page</T.Title>
      <S.Container onClick={startScrape}>
        <S.ButtonText>{`Start Scrape for ${currentYear}`}</S.ButtonText>
      </S.Container>
    </T.FlexColumnCenterContainer>
  );
};
