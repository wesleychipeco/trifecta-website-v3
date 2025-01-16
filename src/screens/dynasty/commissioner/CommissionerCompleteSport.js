import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";
import { returnMongoCollection } from "database-management";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import { GMDropdownCustomStyles } from "styles/Dropdown.styles";
import { capitalize } from "lodash";
import { GLOBAL_VARIABLES } from "Constants";
import { sportYearToSportAndYear } from "utils/years";
import { extractBetweenParentheses } from "utils/strings";

const CHAMPION_STRING = "CHAMPION (9)";
const RUNNER_UP_STRING = "RUNNER-UP (4)";
const SEMIFINALIST_1_STRING = "SEMIFINALIST#1 (1)";
const SEMIFINALIST_2_STRING = "SEMIFINALIST#2 (1)";

const PLAYOFF_POINT_EARNERS = [
  CHAMPION_STRING,
  RUNNER_UP_STRING,
  SEMIFINALIST_1_STRING,
  SEMIFINALIST_2_STRING,
];

export const CommissionerCompleteSport = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const [earners, setEarners] = useState({
    CHAMPION_STRING: "",
    RUNNER_UP_STRING: "",
    SEMIFINALIST_1_STRING: "",
    SEMIFINALIST_2_STRING: "",
  });
  const [gmsArray, setGmsArray] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
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

  const leagueOptions = useMemo(() => {
    return inSeasonLeagues.map((league) => {
      return {
        value: league,
        label: capitalize(league),
      };
    });
  }, [isReady]);

  const handleLeagueChange = useCallback((event) => {
    setSelectedLeague(event?.value);
  }, []);

  const handleEarnerChange = useCallback(
    (event, earner) => {
      const copyEarners = { ...earners };
      copyEarners[earner] = event.value;
      setEarners(copyEarners);
    },
    [earners]
  );

  const options = useMemo(() => {
    return gmsArray.map((gm) => ({
      value: gm,
      label: gm,
    }));
  }, [gmsArray]);

  const savePlayoffPoints = useCallback(async () => {
    const globalVariablesCollection = await returnMongoCollection(
      GLOBAL_VARIABLES
    );
    const { sport, year } = sportYearToSportAndYear(selectedLeague);
    const standingsCollection = await returnMongoCollection(
      `${sport}Standings`,
      era
    );

    const globalVariablesRaw = await globalVariablesCollection.find({});
    const globalVariables = globalVariablesRaw[0];
    const standingsRaw = await standingsCollection.find({ year });
    const standingsCopy = { ...standingsRaw[0] };
    const dynastyStandings = standingsRaw[0].dynastyStandings;

    // Add playoff points to standings object
    Object.keys(earners).forEach(function (k) {
      const gm = earners[k];
      const points = Number(extractBetweenParentheses(k));

      for (let i = 0; i < dynastyStandings.length; i++) {
        const standingGm = dynastyStandings[i];
        const standingGmName = standingGm.gm;
        if (gm === standingGmName) {
          standingGm.playoffPoints = points;
          const totalDynastyPoints = standingGm.totalDynastyPoints + points;
          standingGm.totalDynastyPoints = totalDynastyPoints;
          break;
        }
      }
    });

    standingsCopy["dynastyStandings"] = dynastyStandings;

    // Remove league from in-season leagues and add to completed leagues
    const isl = globalVariables.dynasty.inSeasonLeagues;
    const filteredIsl = isl.filter((league) => league !== selectedLeague);
    globalVariables.dynasty.inSeasonLeagues = filteredIsl;

    const csl = globalVariables.dynasty.completedLeagues;
    csl.push(selectedLeague);
    globalVariables.dynasty.completedLeagues = csl;

    // enrich globalVariables object for insert
    delete globalVariables._id;
    globalVariables.type = "globalVariables";

    console.log("New global variables: ", globalVariables);
    console.log("Updated standings: ", standingsCopy);
    // save updated global variables and sport standings object
    globalVariablesCollection.deleteOne({ type: "globalVariables" });
    globalVariablesCollection.insertOne(globalVariables);

    standingsCollection.deleteOne({ year });
    standingsCollection.insertOne(standingsCopy);

    timeoutSaveMessage("Successfully completed sport and saved collections");
  }, [selectedLeague, era, earners]);

  useEffect(() => {
    if (selectedLeague.length === 0) {
      return;
    }
    for (const key in earners) {
      if (earners[key].length === 0) {
        return;
      }
    }
    setIsSaveButtonEnabled(true);
  }, [era, selectedLeague, earners]);

  const timeoutSaveMessage = useCallback((message) => {
    setSaveMessageText(message);
    setTimeout(() => {
      setSaveMessageText("");
    }, 3000);
  }, []);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Assign Playoff Points</T.Title>
      <div style={{ width: "80%" }}>
        <U.VerticalSpacer factor={4} />
        <U.FlexColumnStart>
          <Select
            placeholder="Select sport"
            options={leagueOptions}
            onChange={handleLeagueChange}
            styles={GMDropdownCustomStyles}
            isSearchable={false}
          />
          <U.VerticalSpacer factor={4} />
          {PLAYOFF_POINT_EARNERS.map((earner, index) => {
            return (
              <S.AssignDraftSlotsEachRow key={index}>
                <S.AssignDraftSlotsText>{`${earner} Points:`}</S.AssignDraftSlotsText>
                <Select
                  placeholder="Select GM"
                  defaultValue={earners[earner]}
                  onChange={(e) => handleEarnerChange(e, earner)}
                  options={options}
                  styles={GMDropdownCustomStyles}
                  isSearchable={false}
                />
              </S.AssignDraftSlotsEachRow>
            );
          })}
          <U.FlexColumnCentered>
            <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
            <S.SaveButton
              disabled={!isSaveButtonEnabled}
              onClick={savePlayoffPoints}
            >
              Save
            </S.SaveButton>
          </U.FlexColumnCentered>
        </U.FlexColumnStart>
      </div>
    </T.FlexColumnCenterContainer>
  );
};
