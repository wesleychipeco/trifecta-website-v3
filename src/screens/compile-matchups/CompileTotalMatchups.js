import { returnMongoCollection } from "database-management";
import React, { useEffect, useState } from "react";
import { mean, pick } from "lodash";

import { useSelector } from "react-redux";
import * as S from "styles/CompileMatchups.styles";
import * as T from "styles/StandardScreen.styles";
import { calculateWinPer } from "utils/winPer";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const CompileTotalMatchups = () => {
  const { currentYear } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.trifecta
  );

  const [allTimeTeams, setAllTimeTeams] = useState([]);
  const [finalGlobalMatchupsObject, setFinalGlobalMatchupsObject] = useState(
    {}
  );
  const [showSaveButton, setShowSaveButton] = useState(false);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("teamNumbersPerSport");
      const data = await collection.find({ year: currentYear });
      const teamNumbersOuterObject = data?.[0];
      const teamNumbersObject = teamNumbersOuterObject?.teamNumbers;

      const overallTeamNumbers = Object.keys(teamNumbersObject);

      // grab overallTeamNubmers here
      const collection1 = await returnMongoCollection("allTimeTeams");
      const allTimeTeamsData = await collection1.find({});

      const allTime = overallTeamNumbers.map((teamNumber) => {
        const foundTeam = allTimeTeamsData.find(
          (test) => test.teamNumber === teamNumber
        );
        return {
          teamNumber,
          name: foundTeam.ownerNames,
        };
      });
      setAllTimeTeams(allTime);
    };

    load();
  }, [currentYear]);

  const startScrape = async () => {
    for (let i = 0; i < allTimeTeams.length; i++) {
      const eachTeam = allTimeTeams[i];
      const teamNum = eachTeam.teamNumber;

      const matchupsCollection = await returnMongoCollection(
        `owner${teamNum}Matchups`
      );
      const currentYearMatchupsData = await matchupsCollection.find({
        year: currentYear,
      });
      const oldTotalMatchupsData = await matchupsCollection.find({
        year: "all",
      });

      const currentYearMatchups = currentYearMatchupsData?.[0];
      const oldTotalMatchups = oldTotalMatchupsData?.[0];

      const newTotalMatchups = { ...oldTotalMatchups };
      const totalMatchupsWinPerObject = {};

      for (let j = 0; j < SPORTS_ARRAY.length; j++) {
        const sportMatchupsKey = `${SPORTS_ARRAY[j]}Matchups`;
        const currentYearSportsMatchups = currentYearMatchups[sportMatchupsKey];
        // console.log("------------------------");
        // console.log("one sport", sportMatchupsKey, currentYearSportsMatchups);

        for (
          let k = 0;
          k < Object.keys(currentYearSportsMatchups).length;
          k++
        ) {
          const currentYearOwnerObject = currentYearSportsMatchups[k];
          const currentYearOwnerNames = currentYearOwnerObject.ownerNames;

          const totalYearSportsMatchups = oldTotalMatchups[sportMatchupsKey];
          const foundTotalOwner = totalYearSportsMatchups.filter(
            (opposingOwner) =>
              opposingOwner.ownerNames === currentYearOwnerNames
          );
          if (foundTotalOwner.length !== 1) {
            console.log(
              "ERROR!!! did not find opposing owner in total matchups"
            );
            return;
          }

          const {
            wins: currentWins,
            losses: currentLosses,
            ties: currentTies,
            pointsFor: currentPointsFor,
            pointsAgainst: currentPointsAgainst,
          } = currentYearOwnerObject;
          const foundTotalOwnerObject = foundTotalOwner[0];

          const newTotalOwnerObject = {
            ownerNames: currentYearOwnerNames,
            wins: Number(currentWins) + Number(foundTotalOwnerObject.wins),
            losses:
              Number(currentLosses) + Number(foundTotalOwnerObject.losses),
            ties: Number(currentTies) + Number(foundTotalOwnerObject.ties),
          };
          const newWinPer = calculateWinPer(newTotalOwnerObject);
          newTotalOwnerObject["winPer"] = newWinPer;

          if (
            currentPointsFor !== undefined &&
            currentPointsAgainst !== undefined
          ) {
            newTotalOwnerObject["pointsFor"] =
              Number(currentPointsFor) +
              Number(foundTotalOwnerObject.pointsFor);
            newTotalOwnerObject["pointsAgainst"] =
              Number(currentPointsAgainst) +
              Number(foundTotalOwnerObject.pointsAgainst);
            newTotalOwnerObject["pointsDiff"] =
              newTotalOwnerObject["pointsFor"] -
              newTotalOwnerObject["pointsAgainst"];
          }

          // console.log("each owner name", currentYearOwnerNames);
          // console.log("current year matchups", currentYearOwnerObject);
          // console.log("FOUND in total", foundTotalOwnerObject);
          // console.log("new", newTotalOwnerObject);

          const previous = newTotalMatchups[sportMatchupsKey];
          // console.log("previous", previous);
          const newPrevious = previous.filter(
            (newTotal) => newTotal.ownerNames !== currentYearOwnerNames
          );
          // console.log("newprevious", newPrevious);
          newPrevious.push(newTotalOwnerObject);

          // console.log("newnew", newPrevious);
          // console.log("__________");

          // reassign
          newTotalMatchups[sportMatchupsKey] = newPrevious;

          // add to totalMatchupsWinObject
          const check = totalMatchupsWinPerObject[currentYearOwnerNames];
          if (check) {
            const newArray = [
              ...totalMatchupsWinPerObject[currentYearOwnerNames],
            ];
            newArray.push(newWinPer);
            totalMatchupsWinPerObject[currentYearOwnerNames] = newArray;
          } else {
            totalMatchupsWinPerObject[currentYearOwnerNames] = [newWinPer];
          }
        } // end of each opposing owner loop
      } // end of each sport loop

      const totalMatchupsArray = [...newTotalMatchups["totalMatchups"]];
      const nonDuplicatedTotalMatchupsArray = totalMatchupsArray.filter(
        (each) =>
          !Object.keys(totalMatchupsWinPerObject).includes(each.ownerNames)
      );

      for (let m = 0; m < Object.keys(totalMatchupsWinPerObject).length; m++) {
        const totalOwnerName = Object.keys(totalMatchupsWinPerObject)[m];
        const [basketballWinPer, baseballWinPer, footballWinPer] =
          totalMatchupsWinPerObject[totalOwnerName];

        const eachOwnerTotalWinPerObject = {
          ownerNames: totalOwnerName,
          basketballWinPer,
          baseballWinPer,
          footballWinPer,
          totalWinPer: Number(
            mean([basketballWinPer, baseballWinPer, footballWinPer]).toFixed(3)
          ),
        };
        nonDuplicatedTotalMatchupsArray.push(eachOwnerTotalWinPerObject);
      }
      const finalMatchupsObject = { ...newTotalMatchups };
      finalMatchupsObject["totalMatchups"] = nonDuplicatedTotalMatchupsArray;
      finalGlobalMatchupsObject[teamNum] = pick(finalMatchupsObject, [
        "year",
        "basketballMatchups",
        "baseballMatchups",
        "footballMatchups",
        "totalMatchups",
      ]);
      // save as final matchup, then print and show save button to save
    } // end of each owner loop

    setFinalGlobalMatchupsObject(finalGlobalMatchupsObject);
    setShowSaveButton(true);
  };

  // make new function that aggregates all of the matchups and saves to mongoDB
  const saveMatchups = async () => {
    console.log("Uncomment to test!");
    // for (const teamNumber in finalGlobalMatchupsObject) {
    //   const collection = await returnMongoCollection(
    //     `owner${teamNumber}Matchups`
    //   );
    //   await collection.deleteMany({ year: "all" });
    //   await collection.insertOne(finalGlobalMatchupsObject[teamNumber]);
    //   console.log("Completed teamNumber", teamNumber);
    // }
  };

  console.log("Final Matchups Object:", finalGlobalMatchupsObject);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Compile Total Matchups Page</T.Title>
      {Object.keys(allTimeTeams).length > 0 && (
        <div>
          <h3>For the following teams...</h3>
          {allTimeTeams.map((team) => {
            return <p key={team.name}>{`${team.teamNumber} - ${team.name}`}</p>;
          })}
          <S.Container onClick={startScrape}>
            <S.ButtonText>{`Compile Total Matchups for ${currentYear}`}</S.ButtonText>
          </S.Container>
        </div>
      )}
      {showSaveButton && (
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
