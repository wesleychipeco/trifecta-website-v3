import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "components/button/Button";
import { ROUTES, STATIC_ROUTES } from "Routes";
import { splitInto2Arrays } from "utils/arrays";
import * as S from "styles/CommissionerInitializeSupplementalDraftPicks.styles";
import * as T from "styles/StandardScreen.styles";
import { returnMongoCollection } from "database-management";
import { numberToOrdinal } from "utils/strings";
import { cloneDeep } from "lodash";

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

  const saveInitialSupplementalDraftPicks = useCallback(async () => {
    console.log("starting year", startingYear, startingYear.length);
    const numberYear = Number(startingYear);
    console.log("ny", numberYear);
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
            draftPicks = 4;
            break;
          case "baseball":
            draftPicks = 7;
            break;
          case "football":
            draftPicks = 5;
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
      if (modifiedCount < 1) {
        timeoutSaveMessage(
          "Did NOT successfully update assets with initialized supplemental draft picks!"
        );
      } else if (modifiedCount === 1) {
        timeoutSaveMessage(
          "Initial supplemental draft picks saved successfully!"
        );
      }
    }

    // save to drafts collection in DB the raw list (and figure out how to display non-grid)
  }, [startingYear, era]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Initialize Supplemental Draft Picks</T.Title>
      <S.CommissionerInitializeSupplementaryDraftPicksText>
        Enter Year (First year of Supplemental Drafts)
      </S.CommissionerInitializeSupplementaryDraftPicksText>
      <S.CommissionerInitializeSupplementaryDraftPicksRowContainer>
        <S.ManualInput
          type="text"
          name="startingYear"
          placeholder="Enter year..."
          onChange={onChangeYear}
          value={startingYear}
        />
        <S.SaveButton onClick={saveInitialSupplementalDraftPicks}>
          Save
        </S.SaveButton>
      </S.CommissionerInitializeSupplementaryDraftPicksRowContainer>
      <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
    </T.FlexColumnCenterContainer>
  );
};
