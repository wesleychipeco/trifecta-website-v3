import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";
import { returnMongoCollection } from "database-management";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { MOBILE_MAX_WIDTH } from "styles/global";
import { capitalize, uniq } from "lodash";
import { assignSupplementalDraftSlots } from "./AssignDraftSlotsHelper";
import {
  ALPHABET,
  NUMBER_OF_TEAMS,
  STARTING_YEAR_SUPPLEMENTAL_DRAFT_PICKS,
} from "Constants";

export const CommissionerAssignSupplementalDraftSlots = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [gmsArray, setGmsArray] = useState([]);
  const [draftSlotAssignments, setDraftSlotAssignments] = useState({});
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedYear, setSelectedYear] = useState(0);
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
      // eslint-disable-next-line array-callback-return
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

  const yearOptions = useMemo(() => {
    const yearArray = [];
    const startingYear = STARTING_YEAR_SUPPLEMENTAL_DRAFT_PICKS;
    for (let year = startingYear; year < startingYear + 4; year++) {
      const yearObj = {
        value: year,
        label: year,
      };
      yearArray.push(yearObj);
    }

    return yearArray;
  }, []);

  const handleSportChange = useCallback((event) => {
    setSelectedSport(event?.value);
  }, []);

  const handleYearChange = useCallback((event) => {
    setSelectedYear(event?.value);
  }, []);

  const handleDraftSlotChange = useCallback(
    (event, gm) => {
      const abbreviation = getAbbreviation(gm);
      const draftSlot = event?.value ?? 0;
      const copyDraftSlotAssignments = { ...draftSlotAssignments };
      copyDraftSlotAssignments[abbreviation] = draftSlot;

      setDraftSlotAssignments(copyDraftSlotAssignments);
    },
    [draftSlotAssignments, getAbbreviation]
  );

  // check for save button enable/disable
  useEffect(() => {
    for (let i = 0; i < Object.keys(draftSlotAssignments).length; i++) {
      const key = Object.keys(draftSlotAssignments)[i];
      if (
        draftSlotAssignments[key] === 0 ||
        selectedSport === "" ||
        selectedYear === 0
      ) {
        setIsSaveButtonEnabled(false);
        break;
      }

      // if all assignments are made and are no longer 0, enable save button
      setIsSaveButtonEnabled(true);
    }
  }, [draftSlotAssignments, selectedSport, selectedYear]);

  const saveToDraftsDB = useCallback(
    async (era, sport, year, grid) => {
      const draftsCollection = await returnMongoCollection("drafts", era);
      const sportYear = `${sport}-${year}`;

      // delete record before re-adding with "grid" key instead of "picks"
      (await draftsCollection).deleteOne({ type: sportYear });
      const draftObject = {
        type: sportYear,
        grid,
        createdAt: new Date().toISOString(),
      };

      (await draftsCollection).insertOne(draftObject);
      timeoutSaveMessage("Successfully saved grid to drafts collection");
    },
    [timeoutSaveMessage]
  );

  const modifyAndSaveGmAssets = useCallback(
    async (era, sport, year, grid) => {
      const gmsCollection = await returnMongoCollection("gms", era);
      const gms = await gmsCollection.find({});

      let modifiedCountTotal = 0;
      // Loop through each team's assets to find the sport and year's supplemental draft picks
      for (let i = 0; i < gms.length; i++) {
        const eachGm = gms[i];
        const gmAbbreviation = eachGm.abbreviation;
        const gmSportDraftPicks = eachGm["assets"][sport]["draftPicks"];

        const modifiedGmSportDraftPicks = gmSportDraftPicks.map(
          (eachPickOfGm) => {
            const isCorrectYear = eachPickOfGm.substr(0, 4) === `${year}`;

            if (isCorrectYear) {
              const isTradedPick = eachPickOfGm.includes("via");
              const roundNumber = eachPickOfGm.substr(5, 1);
              const arrayIndexNumber = roundNumber - 1;
              const roundOfPicks = grid[arrayIndexNumber];

              // loop through each pick in the appropriate round to find the correct overallPick number from grid
              let overallPickNumber;
              for (let j = 0; j < roundOfPicks.length; j++) {
                const eachPickInGrid = roundOfPicks[j];
                const teamToMatch = isTradedPick
                  ? eachPickOfGm.substr(eachPickOfGm.indexOf("via") + 4) // use team acquired pick from, to pick from grid
                  : gmAbbreviation; // else use own placement in grid

                if (eachPickInGrid.fantasyTeam === teamToMatch) {
                  overallPickNumber = eachPickInGrid.overallPick;
                  break;
                }
              } // end of for lopp through round of the grid
              return `${eachPickOfGm} (${overallPickNumber})`;
            }

            // if not appropriate year, just return back original draft pick asset text
            return eachPickOfGm;
          } // end of if (isCorrectYear)
        ); // end of map

        console.log(
          `final list for ${gmAbbreviation}: ${modifiedGmSportDraftPicks}`
        );

        const keyString = `assets.${sport}.draftPicks`;
        const { modifiedCount } = await gmsCollection.updateOne(
          { abbreviation: gmAbbreviation },
          { $set: { [keyString]: modifiedGmSportDraftPicks } }
        );
        modifiedCountTotal += modifiedCount;
      } // end of for loop through gms

      if (modifiedCountTotal === NUMBER_OF_TEAMS) {
        timeoutSaveMessage(
          "Successfully saved updated draft assets to all GM records"
        );
      }
    },
    [timeoutSaveMessage]
  );

  const saveDraftSlots = useCallback(async () => {
    // check for duplicates
    const draftSlotsArray = Object.values(draftSlotAssignments);
    const uniqueArray = uniq(draftSlotsArray);
    if (uniqueArray.length !== NUMBER_OF_TEAMS) {
      timeoutSaveMessage("Warning!!! Not all draft slot values are unique");
      return;
    }

    // create grid
    const grid = await assignSupplementalDraftSlots(
      era,
      selectedSport,
      selectedYear,
      draftSlotAssignments
    );
    console.log("Grid!", grid);

    await saveToDraftsDB(era, selectedSport, selectedYear, grid);
    await modifyAndSaveGmAssets(era, selectedSport, selectedYear, grid);
  }, [
    era,
    draftSlotAssignments,
    selectedSport,
    selectedYear,
    modifyAndSaveGmAssets,
    saveToDraftsDB,
    timeoutSaveMessage,
  ]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Assign Supplemental Draft Picks</T.Title>
      <S.AssignDraftSlotsRowContainer>
        {gmsArray.map((gm, index) => {
          return (
            <S.AssignDraftSlotsEachRow key={index}>
              <S.AssignDraftSlotsText>{`TEAM ${ALPHABET[index]}: ${gm}`}</S.AssignDraftSlotsText>
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
            </S.AssignDraftSlotsEachRow>
          );
        })}
      </S.AssignDraftSlotsRowContainer>
      <S.AssignDraftSlotsEachRow>
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
        <Select
          placeholder="Select year"
          options={yearOptions}
          onChange={handleYearChange}
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
      </S.AssignDraftSlotsEachRow>
    </T.FlexColumnCenterContainer>
  );
};
