import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Select from "react-select";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import { GMDropdownCustomStyles } from "styles/Dropdown.styles";
import { capitalize } from "lodash";
import { GLOBAL_VARIABLES } from "Constants";
import { sportYearToSportAndYear } from "utils/years";
import { extractBetweenParentheses } from "utils/strings";
import { api } from "utils/api";

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
    (state) => state?.currentVariables?.seasonVariables?.dynasty,
  );
  const [earners, setEarners] = useState({
    [CHAMPION_STRING]: "",
    [RUNNER_UP_STRING]: "",
    [SEMIFINALIST_1_STRING]: "",
    [SEMIFINALIST_2_STRING]: "",
  });
  const [gmsArray, setGmsArray] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("");
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [saveMessageText, setSaveMessageText] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const gmData = await api.get("/gms");

      const gmNamesArray = gmData.map(
        (gm) => `${gm.name} (${gm.abbreviation})`,
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
  }, [inSeasonLeagues]);

  const handleLeagueChange = useCallback((event) => {
    setSelectedLeague(event?.value);
  }, []);

  const handleEarnerChange = useCallback(
    (event, earner) => {
      const copyEarners = { ...earners };
      copyEarners[earner] = event.value;
      setEarners(copyEarners);
    },
    [earners],
  );

  const options = useMemo(() => {
    return gmsArray.map((gm) => ({
      value: gm,
      label: gm,
    }));
  }, [gmsArray]);

  const timeoutSaveMessage = useCallback((message) => {
    setSaveMessageText(message);
    setTimeout(() => {
      setSaveMessageText("");
    }, 3000);
  }, []);

  const savePlayoffPoints = useCallback(async () => {
    const { sport, year } = sportYearToSportAndYear(selectedLeague);

    const globalVariables = await api.get("/global-variables");
    const standingsData = await api.get(`/standings/${sport}/${year}`);
    const standingsCopy = { ...standingsData };
    const dynastyStandings = standingsData.dynastyStandings;

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
    await api.put("/update/global-variables", globalVariables);
    await api.put(`/update/standings/${sport}/${year}`);

    timeoutSaveMessage("Successfully completed sport and saved collections");
  }, [selectedLeague, era, earners, timeoutSaveMessage]);

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
