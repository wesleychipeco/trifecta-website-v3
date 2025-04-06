import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";
import { returnMongoCollection } from "database-management";
import { MOBILE_MAX_WIDTH } from "styles/global";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { SPORTS_ARRAY } from "Constants";
import { capitalize, flatten, lowerCase, sortBy } from "lodash";

export const CommissionerTradeFutureDraftPicks = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [gmsObject, setGmsObject] = useState({});
  const [givingGm, setGivingGm] = useState("");
  const [receivingGm, setReceivingGm] = useState("");
  const [givingGmAssets, setGivingGmAssets] = useState([]);
  const [selectedDraftPick, setSelectedDraftPick] = useState("");
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [saveMessageText, setSaveMessageText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({});

      const gmObjectByAbbreviation = {};
      for (let i = 0; i < gmData.length; i++) {
        const gm = gmData[i];
        const abbreviation = gm.abbreviation;
        gmObjectByAbbreviation[abbreviation] = gm;
      }
      setGmsObject(gmObjectByAbbreviation);
    };

    if (isReady) {
      loadData();
    }
  }, [era, isReady]);

  const gmOptions = useMemo(() => {
    const gmAbbreviations = Object.keys(gmsObject);
    const gmSelectArray = [];
    for (let i = 0; i < gmAbbreviations.length; i++) {
      const gmAbb = gmAbbreviations[i];
      const gmObj = {
        value: gmAbb,
        label: gmAbb,
      };
      gmSelectArray.push(gmObj);
    }
    return gmSelectArray;
  }, [gmsObject]);

  useEffect(() => {
    setIsSaveButtonEnabled(
      givingGm.length > 0 &&
        selectedDraftPick.length > 0 &&
        receivingGm.length > 0 &&
        givingGm !== receivingGm
    );
  }, [givingGm, selectedDraftPick, receivingGm]);

  const handleGivingGmChange = useCallback(
    (e) => {
      setGivingGm(e.value);
      const allAssets = [];
      const assets = gmsObject[e.value].assets;
      for (let i = 0; i < SPORTS_ARRAY.length; i++) {
        const sport = SPORTS_ARRAY[i];
        const sportAssets = assets[sport]["draftPicks"];
        const sportAssetsIdentified = sportAssets.map((eachPick) => {
          const identifiedAsset = `${capitalize(sport)} ${eachPick}`;
          return {
            value: identifiedAsset,
            label: identifiedAsset,
          };
        });
        allAssets.push(sportAssetsIdentified);
      }
      const allAssetsFlattened = flatten(allAssets);
      console.log("Giving GM: ", e, "assets: ", allAssetsFlattened);
      setGivingGmAssets(allAssetsFlattened);
    },
    [gmsObject]
  );

  const handleReceivingGmChange = useCallback((e) => {
    console.log("Receiving GM: ", e);
    setReceivingGm(e.value);
  }, []);

  const handleSelectedDraftPick = useCallback((e) => {
    setSelectedDraftPick(e.value);
  }, []);

  const saveTrade = useCallback(async () => {
    console.log(
      "Save selected ",
      `${selectedDraftPick} via ${givingGm} to ${receivingGm}`
    );
    const sportIndex = selectedDraftPick.indexOf(" ");
    const sport = lowerCase(selectedDraftPick.substring(0, sportIndex));
    const matchDraftPick = selectedDraftPick.substring(sportIndex + 1);

    console.log("gms object", gmsObject);

    const givingGmDraftPicks =
      gmsObject[givingGm]["assets"][sport]["draftPicks"];
    const withoutRemovedSelectedDraftPick = givingGmDraftPicks.filter(
      (pick) => pick !== matchDraftPick
    );
    console.log("wr", withoutRemovedSelectedDraftPick);

    const receivingGmDraftPicks =
      gmsObject[receivingGm]["assets"][sport]["draftPicks"];
    receivingGmDraftPicks.push(`${matchDraftPick} via ${givingGm}`);
    const sortedReceivingGmDraftPicks = sortBy(receivingGmDraftPicks);
    console.log("two", sortedReceivingGmDraftPicks);

    let totalSuccessfulOperations = 0;
    // remove from giving gm's assets and save
    const gmsCollection = await returnMongoCollection("gms", era);
    const gmKeyString = `assets.${sport}.draftPicks`;
    const { modifiedCount: givingGmModifiedCount } =
      await gmsCollection.updateOne(
        { abbreviation: givingGm },
        { $set: { [gmKeyString]: withoutRemovedSelectedDraftPick } }
      );
    totalSuccessfulOperations += givingGmModifiedCount;

    // add to receiving gm's assets and save
    const { modifiedCount: receivingGmModifiedCount } =
      await gmsCollection.updateOne(
        { abbreviation: receivingGm },
        { $set: { [gmKeyString]: sortedReceivingGmDraftPicks } }
      );
    totalSuccessfulOperations += receivingGmModifiedCount;

    console.log(
      "TOTAL SUCCESSFUL OPERATIONS COUNT: ",
      totalSuccessfulOperations
    );

    const year = matchDraftPick.substring(0, 4);
    const roundAndPick = matchDraftPick.substring(5);
    const draftsCollection = await returnMongoCollection("drafts", era);
    const draftData = await draftsCollection.find({ type: `${sport}-${year}` });
    console.log("matchd", matchDraftPick);

    console.log("draft data", draftData);
    const draftGrid = draftData?.[0]?.grid ?? null;
    const draftPicks = draftData?.[0]?.picks ?? null;
    console.log("draftGrid", draftGrid);
    console.log("draftPicks", draftPicks);
    const isGrid = draftGrid !== null;
    console.log("isGRID", isGrid);
    const draftToUse = isGrid ? draftGrid : draftPicks;

    console.log("round and pick", roundAndPick);
    for (let i = 0; i < draftToUse.length; i++) {
      const eachRow = draftToUse[i];
      for (let j = 0; j < eachRow.length; j++) {
        const eachPick = eachRow[j];
        const startParentheses = roundAndPick.indexOf("(") + 1;
        const endParentheses = roundAndPick.indexOf(")");
        const overallPick = roundAndPick.substring(
          startParentheses,
          endParentheses
        );

        // different pick matching logic depending if set grid or not
        const isCorrectPick = isGrid
          ? overallPick === eachPick.overallPick.toString()
          : roundAndPick === eachPick.pick;

        if (givingGm === eachPick.fantasyTeam && isCorrectPick) {
          eachPick["tradedTo"] = receivingGm;
        }
      }
    }

    console.log("DRAFT TO USE", draftToUse);
    const draftKeyString = isGrid ? "grid" : "picks";
    // add `tradedTo` to draft board for this pick and save
    const { modifiedCount: draftsModifiedCount } =
      await draftsCollection.updateOne(
        { type: `${sport}-${year}` },
        { $set: { [draftKeyString]: draftToUse } }
      );
    totalSuccessfulOperations += draftsModifiedCount;

    if (totalSuccessfulOperations === 3) {
      setSaveMessageText("Successfully executed trade in DB");
    } else {
      setSaveMessageText("DID NOT SUCCESSFULLY FULLY EXECUTE TRADE IN DB");
    }

    console.log("DRAFT TO USE", draftToUse);

    // clean up styling
  }, [era, gmsObject, givingGm, selectedDraftPick, receivingGm]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Trade Future Draft Picks</T.Title>
      <S.TradeDraftPicksRowContainer>
        <T.FlexColumnCenterContainer>
          <S.SectionTitle>Giving GM</S.SectionTitle>
          <U.FlexRow>
            <Select
              placeholder="Select Giving GM"
              options={gmOptions}
              onChange={handleGivingGmChange}
              styles={
                isMobile
                  ? MobileMatchupsDropdownCustomStyles
                  : MatchupsDropdownCustomStyles
              }
              isSearchable={false}
            />
            <U.HorizontalSpacer factor={4} />
            <Select
              placeholder="Select Giving GM To Select Draft Pick"
              options={givingGmAssets}
              onChange={handleSelectedDraftPick}
              styles={
                isMobile
                  ? MobileMatchupsDropdownCustomStyles
                  : MatchupsDropdownCustomStyles
              }
              isSearchable={false}
              isDisabled={givingGmAssets.length < 1}
            />
          </U.FlexRow>
        </T.FlexColumnCenterContainer>
        <T.FlexColumnCenterContainer>
          <S.SectionTitle>Receiving GM</S.SectionTitle>
          <Select
            placeholder="Select Receiving GM"
            options={gmOptions}
            onChange={handleReceivingGmChange}
            styles={
              isMobile
                ? MobileMatchupsDropdownCustomStyles
                : MatchupsDropdownCustomStyles
            }
            isSearchable={false}
          />
        </T.FlexColumnCenterContainer>
        <T.FlexColumnCenterContainer>
          <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
          <S.SaveButton disabled={!isSaveButtonEnabled} onClick={saveTrade}>
            Save
          </S.SaveButton>
        </T.FlexColumnCenterContainer>
      </S.TradeDraftPicksRowContainer>
    </T.FlexColumnCenterContainer>
  );
};
