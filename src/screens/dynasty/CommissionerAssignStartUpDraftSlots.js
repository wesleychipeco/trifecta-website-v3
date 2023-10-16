import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";
import { returnMongoCollection } from "database-management";

import * as S from "styles/CommissionerAssignDraftSlots.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { MOBILE_MAX_WIDTH } from "styles/global";
import { capitalize, uniq } from "lodash";
import { assignStartupDraftSlots } from "./AssignDraftSlotsHelper";

const ALPHABET = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
];

export const CommissionerAssignStartupDraftSlots = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [gmsArray, setGmsArray] = useState([]);
  const [draftSlotAssignments, setDraftSlotAssignments] = useState([]);
  const [selectedSport, setSelectedSport] = useState("");
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [saveMessageText, setSaveMessageText] = useState("");

  // load data on page load
  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({});

      const gmNamesArray = gmData.map(
        (gm) => `${gm.name} (${gm.abbreviation})`
      );

      setGmsArray(gmNamesArray);

      const initialDraftSlotAssignments = {};
      gmData.map((gm) => {
        initialDraftSlotAssignments[gm?.abbreviation] = 0;
      });

      setDraftSlotAssignments(initialDraftSlotAssignments);
    };

    if (isReady) {
      loadData();
    }
  }, [era, isReady]);

  // set options and functions on page load
  const options = useMemo(() => {
    return ALPHABET.map((_, index) => {
      return {
        value: index + 1,
        label: index + 1,
      };
    });
  }, []);

  const getAbbreviation = useCallback((gmString) => {
    return gmString.substring(gmString.indexOf("(") + 1, gmString.indexOf(")"));
  }, []);

  const timeoutSaveMessage = useCallback((message) => {
    setSaveMessageText(message);
    setTimeout(() => {
      setSaveMessageText("");
    }, 3000);
  }, []);

  const sportsOptions = useMemo(() => {
    return ["basketball", "baseball", "football"].map((sport) => {
      return {
        value: sport,
        label: capitalize(sport),
      };
    });
  }, []);

  const handleSportChange = useCallback((event) => {
    setSelectedSport(event?.value);
  }, []);

  const handleDraftSlotChange = useCallback(
    (event, gm) => {
      const abbreviation = getAbbreviation(gm);
      const draftSlot = event?.value ?? 0;
      const copyDraftSlotAssignments = { ...draftSlotAssignments };
      copyDraftSlotAssignments[abbreviation] = draftSlot;

      setDraftSlotAssignments(copyDraftSlotAssignments);
    },
    [options, draftSlotAssignments]
  );

  // check for save button enable/disable
  useEffect(() => {
    for (let i = 0; i < Object.keys(draftSlotAssignments).length; i++) {
      const key = Object.keys(draftSlotAssignments)[i];
      if (draftSlotAssignments[key] === 0 || selectedSport === "") {
        setIsSaveButtonEnabled(false);
        break;
      }

      // if all assignments are made and are no longer 0, enable save button
      setIsSaveButtonEnabled(true);
    }
  }, [draftSlotAssignments, selectedSport]);

  const saveToDB = async (era, sport, year, grid) => {
    const draftsCollection = returnMongoCollection("drafts", era);
    const draftObject = {
      type: `${sport}-${year}`,
      grid,
      createdAt: new Date().toISOString(),
    };

    (await draftsCollection).insertOne(draftObject);
    timeoutSaveMessage("Successfully saved grid to drafts collection");
  };

  const saveDraftSlots = useCallback(async () => {
    // check for duplicates
    const draftSlotsArray = Object.values(draftSlotAssignments);
    console.log("draft slots array", draftSlotsArray);
    const uniqueArray = uniq(draftSlotsArray);
    if (uniqueArray.length != 16) {
      timeoutSaveMessage("Warning!!! Not all draft slot values are unique");
      return;
    }

    const grid = assignStartupDraftSlots(selectedSport, draftSlotAssignments);
    await saveToDB(era, selectedSport, "startup", grid);
  }, [era, draftSlotAssignments, selectedSport]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Assign Startup Draft Picks</T.Title>
      <S.CommissionerAssignDraftSlotsRowContainer>
        {gmsArray.map((gm, index) => {
          return (
            <S.CommissionerAssignDraftSlotsEachRow key={index}>
              <S.CommissionerAssignDraftSlotsText>{`TEAM ${ALPHABET[index]}: ${gm}`}</S.CommissionerAssignDraftSlotsText>
              <Select
                placeholder="Select draft slot"
                options={options}
                onChange={(e) => handleDraftSlotChange(e, gm)}
                styles={
                  isMobile
                    ? MobileMatchupsDropdownCustomStyles
                    : MatchupsDropdownCustomStyles
                }
                isSearchable={false}
              />
            </S.CommissionerAssignDraftSlotsEachRow>
          );
        })}
      </S.CommissionerAssignDraftSlotsRowContainer>
      <S.CommissionerAssignDraftSlotsEachRow>
        <Select
          placeholder="Select sport"
          options={sportsOptions}
          onChange={handleSportChange}
          styles={
            isMobile
              ? MobileMatchupsDropdownCustomStyles
              : MatchupsDropdownCustomStyles
          }
          isSearchable={false}
        />
        <U.FlexColumnCentered>
          <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
          <S.SaveButton
            disabled={!isSaveButtonEnabled}
            onClick={saveDraftSlots}
          >
            Save
          </S.SaveButton>
        </U.FlexColumnCentered>
      </S.CommissionerAssignDraftSlotsEachRow>
    </T.FlexColumnCenterContainer>
  );
};
