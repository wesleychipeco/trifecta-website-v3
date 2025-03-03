import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { MOBILE_MAX_WIDTH } from "styles/global";
import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { GLOBAL_VARIABLES, NUMBER_OF_TEAMS, SPORTS_ARRAY } from "Constants";

export const CommissionerAssignLeagueTeamIds = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [sport, setSport] = useState("");
  const [year, setYear] = useState("");
  const [leagueId, setLeagueId] = useState("");
  const [gmsArray, setGmsArray] = useState([]);
  const [teamIds, setTeamIds] = useState({});
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [saveMessageText, setSaveMessageText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({});

      const gmNamesArray = gmData.map(
        (gm) => `${gm.name} (${gm.abbreviation})`
      );

      setGmsArray(gmNamesArray);
    };

    if (isReady) {
      loadData();
    }
  }, [era, isReady]);

  const getAbbreviation = useCallback((gmString) => {
    return gmString.substring(gmString.indexOf("(") + 1, gmString.indexOf(")"));
  }, []);

  const timeoutSaveMessage = useCallback(
    (message) => {
      setSaveMessageText(message);
      setTimeout(() => {
        setSaveMessageText("");
      }, 3000);
    },
    [setSaveMessageText]
  );

  const sportsOptions = useMemo(() => {
    return SPORTS_ARRAY.map((sport) => {
      return {
        value: sport,
        label: capitalize(sport),
      };
    });
  }, []);

  const handleSportChange = useCallback(
    (event) => {
      setSport(event?.value);
    },
    [setSport]
  );

  const handleYearChange = useCallback(
    (event) => {
      setYear(event.target.value);
    },
    [setYear]
  );

  const handleLeagueIdChange = useCallback(
    (event) => {
      setLeagueId(event.target.value);
    },
    [setLeagueId]
  );

  const handleTeamIdChange = (gm, event) => {
    const copyTeamIds = { ...teamIds };
    copyTeamIds[gm] = event.target.value;
    setTeamIds(copyTeamIds);
  };

  useEffect(() => {
    let anyEmptyValues = false;
    for (const [key, value] of Object.entries(teamIds)) {
      if (value === "") {
        anyEmptyValues = true;
      }
    }

    const teamIdsLen = Object.keys(teamIds).length;
    const shouldDisableSaveTeamIds =
      anyEmptyValues || teamIdsLen < NUMBER_OF_TEAMS;
    const shouldDisableSaveOther =
      sport === "" || year === "" || leagueId === "";
    setIsSaveButtonEnabled(
      !shouldDisableSaveTeamIds && !shouldDisableSaveOther
    );
  }, [teamIds, setIsSaveButtonEnabled, sport, year, leagueId]);

  const saveIds = useCallback(async () => {
    console.log("teamIds in save", teamIds);

    // update global variables leagueIdMappings
    const globalVariablesCollection = await returnMongoCollection(
      GLOBAL_VARIABLES
    );
    const globalVariablesRaw = await globalVariablesCollection.find({
      type: GLOBAL_VARIABLES,
    });
    const globalVariables = globalVariablesRaw[0];
    const currentLeagueIdMappings = globalVariables.dynasty.leagueIdMappings;
    const sportYear = `${sport}${year}`;
    currentLeagueIdMappings[sportYear] = leagueId;
    globalVariables.dynasty.leagueIdMappings = currentLeagueIdMappings;

    delete globalVariables._id;
    globalVariables.type = GLOBAL_VARIABLES;

    await globalVariablesCollection.deleteOne({ type: GLOBAL_VARIABLES });
    await globalVariablesCollection.insertOne(globalVariables);

    // create new record in gmNamesIds for sportYear
    const mappings = {};
    for (const [gm, teamId] of Object.entries(teamIds)) {
      const gmName = gm.replace("&", "/");
      mappings[teamId] = gmName;
    }
    const newGmNamesIdsObject = {
      leagueId,
      mappings,
      sportYear,
    };

    const gmNamesIdsCollection = await returnMongoCollection("gmNamesIds", era);
    await gmNamesIdsCollection.insertOne(newGmNamesIdsObject);

    // add new mapping to individual gm mappings records
    const gmCollection = await returnMongoCollection("gms", era);

    for (const [gm, teamId] of Object.entries(teamIds)) {
      const abbreviation = getAbbreviation(gm);
      const gmData = await gmCollection.find({ abbreviation });
      const gmObject = gmData?.[0] ?? {};
      const { mappings } = gmObject;
      const copyMappings = { ...mappings };
      copyMappings[sportYear] = teamId;

      const { modifiedCount } = await gmCollection.updateOne(
        { abbreviation },
        { $set: { mappings: copyMappings } }
      );
      if (modifiedCount !== 1) {
        console.error(`Failed to update ${gm}'s teamId mappings.`);
      }
    }

    timeoutSaveMessage("Successfully saved leagueId and teamIds");
  }, [era, teamIds, sport, year, leagueId, timeoutSaveMessage]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Assign New League ID & Team IDs</T.Title>
      <S.AssignDraftSlotsRowContainer>
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
        <S.ManualIdsInput
          type="text"
          name="year"
          placeholder="Enter Year"
          onChange={handleYearChange}
          value={year}
        />
        <S.ManualIdsInput
          type="text"
          name="leagueId"
          placeholder="Enter leagueId"
          onChange={handleLeagueIdChange}
          value={leagueId}
        />
        <U.FlexColumnCentered>
          <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
          <S.SaveButton disabled={!isSaveButtonEnabled} onClick={saveIds}>
            Save
          </S.SaveButton>
        </U.FlexColumnCentered>
      </S.AssignDraftSlotsRowContainer>
      <S.AssignDraftSlotsRowContainer>
        {gmsArray.map((gm, index) => {
          return (
            <S.AssignDraftSlotsEachRow key={index}>
              <S.AssignDraftSlotsText>{`${gm}:`}</S.AssignDraftSlotsText>
              <S.ManualIdsInput
                type="text"
                placeholder="Enter teamId"
                onChange={(e) => handleTeamIdChange(gm, e)}
                value={teamIds[gm] || ""}
              />
            </S.AssignDraftSlotsEachRow>
          );
        })}
      </S.AssignDraftSlotsRowContainer>
    </T.FlexColumnCenterContainer>
  );
};
