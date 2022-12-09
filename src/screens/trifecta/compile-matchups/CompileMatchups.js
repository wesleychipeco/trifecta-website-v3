import axios from "axios";
import { returnMongoCollection } from "database-management";
import React, { useEffect, useState } from "react";
import { mean, sum, uniqBy } from "lodash";

import { useSelector } from "react-redux";
import * as S from "styles/CompileMatchups.styles";
import * as T from "styles/StandardScreen.styles";
import { calculateWinPer } from "utils/winPer";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const CompileMatchups = () => {
  const { currentYear } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.trifecta
  );

  const [matchupsGlobalObject, setMatchupsGlobalObject] = useState({});
  const [allTimeTeams, setAllTimeTeams] = useState([]);
  const [finalGlobalMatchupsObject, setFinalGlobalMatchupsObject] = useState(
    {}
  );

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("teamNumbersPerSport");
      const data = await collection.find({ year: currentYear });
      const teamNumbersObject = data?.[0];

      // grab overallTeamNubmers here
      const collection1 = await returnMongoCollection("allTimeTeams");
      const allTimeTeams = await collection1.find({});
      setAllTimeTeams(allTimeTeams);

      const mgo = createMatchupsGlobalObject(teamNumbersObject);
      if (Object.keys(mgo).length > 0) {
        setMatchupsGlobalObject(mgo);
      }
    };

    load();
  }, [currentYear]);

  // function that creates nested matchups object skeleton. Per sport -> Each owner -> Opposing owner's matchups records
  const createMatchupsGlobalObject = (teamNumbersObject) => {
    if (!teamNumbersObject) {
      return {};
    }
    const matchupsGlobalObject = {};

    // for each sport
    for (let i = 0; i < SPORTS_ARRAY.length; i++) {
      const sportMatchupsObject = {};
      const sport = SPORTS_ARRAY[i];

      const sportTeamNumbers = teamNumbersObject[sport];

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

      // for each owner number, add inner skeleton object
      for (let k = 1; k <= Object.keys(sportTeamNumbers).length; k++) {
        sportMatchupsObject[k] = {
          ownerNames: sportTeamNumbers[k].ownerNames,
          ...JSON.parse(JSON.stringify(everyOwnerMatchupsObject)), // create deep copy
        };
      }
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
      default:
        return "";
    }
  };

  // given matchup results object, return specific record variables
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
      // do not run if matchupsGlobalObject not created
      return;
    }

    const BASKETBALL_URL = `https://fantasy.espn.com/apis/v3/games/fba/seasons/${currentYear}/segments/0/leagues/100660?view=mMatchupScore`;
    const BASEBALL_URL = `https://fantasy.espn.com/apis/v3/games/flb/seasons/${currentYear}/segments/0/leagues/109364?view=mMatchupScore`;
    const FOOTBALL_URL = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${currentYear}/segments/0/leagues/154802?view=mMatchupScore`;

    const urlsArray = [BASKETBALL_URL, BASEBALL_URL, FOOTBALL_URL];

    // loop through each sport
    for (let i = 0; i < urlsArray.length; i++) {
      const sport = determineSport(i);
      const sportUrl = urlsArray[i];
      const response = await axios.get(sportUrl);
      const schedule = response?.data?.schedule ?? [];

      const matchupPeriodIdsArray = [];

      // compile all regular season matchups into matchupsGlobalObject
      for (let j = 0; j < schedule.length; j++) {
        const matchup = schedule[j];

        // only compile matchup records for regular season matchups
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

      // loop through outer then inner objects to total winPer (and pointsDiff)
      const sportObject = matchupsGlobalObject[sport];
      for (let k = 1; k <= Object.keys(sportObject).length; k++) {
        const ownerObject = sportObject[k];

        for (let l = 1; l <= Object.keys(ownerObject).length; l++) {
          // if outerOwnerNumber === innerOwnerNumber, then same owner
          if (k === l) {
            const { wins, losses, ties } = ownerObject[l];
            // confirm that wins, losses, and ties are 0
            if (wins !== 0 || losses !== 0 || ties !== 0) {
              console.log("ERROR: OWNER HAS MATCHUPS AGAINST SELF!");
              return;
            }
            delete matchupsGlobalObject[sport][l][k]; // delete own self from one's inner records
            continue;
          }

          const winPer = calculateWinPer(ownerObject[l]);
          ownerObject[l].winPer = winPer;

          if (sport === "football") {
            const pointsDiff =
              ownerObject[l].pointsFor - ownerObject[l].pointsAgainst;
            ownerObject[l].pointsDiff = Number(pointsDiff.toFixed(1));
          }
        }
      }
    }

    console.log("matchupsGlobalObject", matchupsGlobalObject);
    const {
      basketball: basketballMatchupsObject,
      baseball: baseballMatchupsObject,
      football: footballMatchupsObject,
    } = matchupsGlobalObject;

    const remappedFootballNumbers = {};
    for (let footballNumber in footballMatchupsObject) {
      const footballOwnerNames =
        footballMatchupsObject[footballNumber].ownerNames;
      remappedFootballNumbers[footballOwnerNames] = footballNumber;
    }
    // console.log("remapped football numbers", remappedFootballNumbers);

    // Loop through all owners to compile all sports matchups and calculate totalMatchups
    for (let m = 1; m <= Object.keys(basketballMatchupsObject).length; m++) {
      const basketballMatchups = [];
      const baseballMatchups = [];
      const footballMatchups = [];
      const totalMatchups = [];

      const eachOuterOwnerMatchupsObject = basketballMatchupsObject[m];
      const outerOwnerName = eachOuterOwnerMatchupsObject.ownerNames;
      const outerFootballNumber = remappedFootballNumbers[outerOwnerName];

      const innerOwnersArray = Object.keys(eachOuterOwnerMatchupsObject).filter(
        (each) => each !== "ownerNames"
      );

      // loop through each owner's opposing owners to calculate and group together total & each sport's matchups
      for (let n = 0; n < Object.keys(innerOwnersArray).length; n++) {
        const innerOwnerKey = innerOwnersArray[n];
        const innerOwnerMatchupObject =
          eachOuterOwnerMatchupsObject[innerOwnerKey];
        const innerOwnerName = innerOwnerMatchupObject.ownerNames;
        const innerFootballNumber = remappedFootballNumbers[innerOwnerName];

        const innerBasketballMatchupsObject =
          basketballMatchupsObject[m][innerOwnerKey];
        const innerBaseballMatchupsObject =
          baseballMatchupsObject[m][innerOwnerKey];
        const innerFootballMatchupsObject =
          footballMatchupsObject[outerFootballNumber][innerFootballNumber];

        const basketballWinPer = innerBasketballMatchupsObject.winPer;
        const baseballlWinPer = innerBaseballMatchupsObject.winPer;
        const footballlWinPer = innerFootballMatchupsObject.winPer;
        const totalWinPer = Number(
          mean([basketballWinPer, baseballlWinPer, footballlWinPer]).toFixed(3)
        );

        const totalMatchupsObject = {
          ownerNames: innerOwnerName,
          basketballWinPer,
          baseballlWinPer,
          footballlWinPer,
          totalWinPer,
        };

        basketballMatchups.push(innerBasketballMatchupsObject);
        baseballMatchups.push(innerBaseballMatchupsObject);
        footballMatchups.push(innerFootballMatchupsObject);
        totalMatchups.push(totalMatchupsObject);
      }
      const allTimeTeamNumber = allTimeTeams.filter(
        (team) => team.ownerNames === outerOwnerName
      )?.[0]?.teamNumber;

      // create object for each owner with appropriate data
      const finalObjectToUpload = {
        year: currentYear,
        ownerNames: outerOwnerName,
        basketballMatchups,
        baseballMatchups,
        footballMatchups,
        totalMatchups,
      };
      finalGlobalMatchupsObject[allTimeTeamNumber] = finalObjectToUpload;
    }

    setFinalGlobalMatchupsObject({ ...finalGlobalMatchupsObject });
  };

  // make new function that aggregates all of the matchups and saves to mongoDB
  const saveMatchups = async () => {
    console.log("Uncomment to test!");
    // for (const teamNumber in finalGlobalMatchupsObject) {
    //   const collection = await returnMongoCollection(`owner${teamNumber}Matchups`);
    //   await collection.deleteMany({year: currentYear});
    //   await collection.insertOne(finalGlobalMatchupsObject[teamNumber])
    // }
  };

  console.log("Final Matchups Object:", finalGlobalMatchupsObject);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Compile Matchups Page</T.Title>
      {Object.keys(matchupsGlobalObject).length > 0 && (
        <S.Container onClick={startScrape}>
          <S.ButtonText>{`Start Scrape for ${currentYear}`}</S.ButtonText>
        </S.Container>
      )}
      {Object.keys(finalGlobalMatchupsObject).length > 0 && (
        <T.FlexColumnCenterContainer>
          <S.ButtonText>
            Check console to verify Final Matchups Object beore saving
          </S.ButtonText>
          <S.Container onClick={saveMatchups}>
            <S.ButtonText>Save Matchups</S.ButtonText>
          </S.Container>
        </T.FlexColumnCenterContainer>
      )}
    </T.FlexColumnCenterContainer>
  );
};
