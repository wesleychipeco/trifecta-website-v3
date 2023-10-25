import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import { returnMongoCollection } from "database-management";
import { numberToOrdinal } from "utils/strings";
import { cloneDeep } from "lodash";
import {
  BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS,
  BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS,
  FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS,
  NUMBER_OF_TEAMS,
} from "./AssignDraftSlotsHelper";

const SPORTS_ARRAY = ["basketball", "baseball", "football"];

export const CommissionerInitializeSupplementalDraftPicks = () => {
  const { era } = useParams();
  const [gmsData, setGmsData] = useState([]);
  const [startingYear, setStartingYear] = useState("");
  const [saveMessageText, setSaveMessageText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({});
      console.log("initial gm data", gmData);
      setGmsData(gmData);
    };

    // call method
    loadData();
  }, [era]);

  const onChangeYear = useCallback((event) => {
    setStartingYear(event.target.value);
  }, []);

  const timeoutSaveMessage = useCallback((message) => {
    setSaveMessageText(message);
    setTimeout(() => {
      setSaveMessageText("");
    }, 3000);
  }, []);

  const saveInitialSupplementalDraftPicksPerGM = useCallback(async () => {
    let numberOfTeamsCompleted = 0;
    const numberYear = Number(startingYear);
    if (startingYear.length !== 4 || isNaN(numberYear)) {
      // throw error
      timeoutSaveMessage("Enter a valid year!");
      return;
    }

    const gmCollection = await returnMongoCollection("gms", era);
    const copyGmsData = cloneDeep(gmsData);
    for (let teamNumber = 0; teamNumber < gmsData.length; teamNumber++) {
      const name = copyGmsData[teamNumber]["name"];

      const copyAssets = cloneDeep(copyGmsData[teamNumber]["assets"]);
      for (let i = 0; i < SPORTS_ARRAY.length; i++) {
        const sport = SPORTS_ARRAY[i];

        let draftPicks;
        switch (sport) {
          case "basketball":
            draftPicks = BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
            break;
          case "baseball":
            draftPicks = BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
            break;
          case "football":
            draftPicks = FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
            break;
          default:
            draftPicks = 0;
            break;
        }

        const defaultDraftPicks = [];
        for (let year = numberYear; year < numberYear + 4; year++) {
          for (let i = 1; i <= draftPicks; i++) {
            const draftPick = `${year} ${i}${numberToOrdinal(i)} Rd Pick`;
            defaultDraftPicks.push(draftPick);
          }
        }

        copyAssets[sport]["draftPicks"] = defaultDraftPicks;
      }

      const { modifiedCount } = await gmCollection.updateOne(
        { name },
        { $set: { assets: copyAssets } }
      );
      numberOfTeamsCompleted += modifiedCount;
    }

    if (numberOfTeamsCompleted < NUMBER_OF_TEAMS) {
      timeoutSaveMessage(
        "Did NOT successfully update assets with initialized supplemental draft picks!"
      );
    } else if (numberOfTeamsCompleted === NUMBER_OF_TEAMS) {
      timeoutSaveMessage(
        "Initial supplemental draft picks saved successfully to GMs collection!"
      );
    }

    // save to drafts collection in DB the raw list (and figure out how to display non-grid)
  }, [startingYear, era]);

  const saveInitialSupplementalDraftPicksPerDraft = useCallback(async () => {
    const numberYear = Number(startingYear);
    if (startingYear.length !== 4 || isNaN(numberYear)) {
      // throw error
      timeoutSaveMessage("Enter a valid year!");
      return;
    }

    const draftsCollection = await returnMongoCollection("drafts", era);
    const copyGmsData = cloneDeep(gmsData);
    for (let i = 0; i < SPORTS_ARRAY.length; i++) {
      const sport = SPORTS_ARRAY[i];

      let draftPicks;
      switch (sport) {
        case "basketball":
          draftPicks = BASKETBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
          break;
        case "baseball":
          draftPicks = BASEBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
          break;
        case "football":
          draftPicks = FOOTBALL_SUPPLEMENTAL_DRAFT_ROUNDS;
          break;
        default:
          draftPicks = 0;
          break;
      }

      for (let year = numberYear; year < numberYear + 4; year++) {
        const eachSportYearGmPicksGrid = [];
        const sportYear = `${sport}-${year}`;

        for (
          let teamNumber = 0;
          teamNumber < copyGmsData.length;
          teamNumber++
        ) {
          const eachGmPicks = [];
          const { abbreviation } = copyGmsData[teamNumber];

          for (let i = 1; i <= draftPicks; i++) {
            const draftPick = `${i}${numberToOrdinal(i)} Rd Pick`;
            const draftPickObject = {
              fantasyTeam: abbreviation,
              pick: draftPick,
            };
            eachGmPicks.push(draftPickObject);
          }
          eachSportYearGmPicksGrid.push(eachGmPicks);
        }

        // console.log(`SPORT-YEAR ${sportYear}: `, eachSportYearGmPicksGrid);

        // save each as sportYear keyed record in mongodb
        await draftsCollection.insertOne({
          type: sportYear,
          picks: eachSportYearGmPicksGrid,
          createdAt: new Date().toISOString(),
        });
      }
    }

    timeoutSaveMessage(
      "Initial supplemental draft picks saved successfully to drafts collection!"
    );
    // save to drafts collection in DB the raw list (and figure out how to display non-grid)
  }, [startingYear, era]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Initialize Supplemental Draft Picks</T.Title>
      <S.InitializeSupplementaryDraftPicksText>
        Enter Year (First year of Supplemental Drafts)
      </S.InitializeSupplementaryDraftPicksText>
      <S.InitializeSupplementaryDraftPicksRowContainer>
        <S.InitializeDraftPicksManualInput
          type="text"
          name="startingYear"
          placeholder="Enter year..."
          onChange={onChangeYear}
          value={startingYear}
        />
        <S.SaveButton onClick={saveInitialSupplementalDraftPicksPerGM}>
          Save Per GM
        </S.SaveButton>
        <S.SaveButton onClick={saveInitialSupplementalDraftPicksPerDraft}>
          Save Per Draft
        </S.SaveButton>
      </S.InitializeSupplementaryDraftPicksRowContainer>
      <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
    </T.FlexColumnCenterContainer>
  );
};
