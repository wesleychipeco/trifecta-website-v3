import { returnMongoCollection } from "database-management";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useParams } from "react-router-dom";
import { MOBILE_MAX_WIDTH } from "styles/global";
import Select from "react-select";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { sportYearToSportAndYear } from "utils/years";
import { capitalize } from "lodash";

const SAMPLE_GM = "CHIP";

export const CommissionerRemoveCompletedDraftPicks = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues, completedLeagues } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [beforeFilterDraftPicks, setBeforeFilterDraftPicks] = useState([]);
  const [afterFilterDraftPicks, setAfterFilterDraftPicks] = useState([]);
  const [saveMessageText, setSaveMessageText] = useState("");

  const transformOptions = useCallback((sportYear) => {
    const { sport, year } = sportYearToSportAndYear(sportYear);
    return {
      value: sportYear,
      label: `${year} ${capitalize(sport)}`,
    };
  }, []);

  const sportYearOptions = useMemo(() => {
    const allSportYearsArray = [];
    if (inSeasonLeagues.length > 0 && completedLeagues.length > 0) {
      for (let i = 0; i < completedLeagues.length; i++) {
        const completedLeague = completedLeagues[i];
        const obj = transformOptions(completedLeague);
        allSportYearsArray.push(obj);
      }

      for (let j = 0; j < inSeasonLeagues.length; j++) {
        const inSeasonLeague = inSeasonLeagues[j];
        const obj = transformOptions(inSeasonLeague);
        allSportYearsArray.push(obj);
      }
    }

    return allSportYearsArray;
  }, [inSeasonLeagues, completedLeagues]);

  const handleSelectedSportYear = useCallback((e) => {
    const { sport, year } = sportYearToSportAndYear(e.value);
    setSelectedSport(sport);
    setSelectedYear(year);
  }, []);

  const filterOutDraftPicks = useCallback(
    (sportDraftPicks) => {
      return sportDraftPicks.filter((eachDraftPick) => {
        const draftPickYear = eachDraftPick.substring(0, 4);
        if (draftPickYear !== selectedYear) {
          return eachDraftPick;
        }
      });
    },
    [selectedYear]
  );

  useEffect(async () => {
    if (isReady && selectedSport !== "" && selectedYear !== "") {
      const retrieveSampleData = async () => {
        const gmsCollection = await returnMongoCollection("gms", era);
        const gmData = await gmsCollection.find({ abbreviation: SAMPLE_GM });
        const gmObj = gmData?.[0] ?? {};

        const sportDraftPicks =
          gmObj?.assets?.[selectedSport]?.draftPicks ?? [];
        setBeforeFilterDraftPicks(sportDraftPicks);

        const filteredDraftPicks = filterOutDraftPicks(sportDraftPicks);
        setAfterFilterDraftPicks(filteredDraftPicks);
      };

      retrieveSampleData();
    }
  }, [isReady, era, selectedSport, selectedYear]);

  const saveChanges = useCallback(async () => {
    const gmsCollection = await returnMongoCollection("gms", era);
    const gmsData = await gmsCollection.find({});
    let totalGmsCount = 0;

    for (const eachGm of gmsData) {
      const { name, assets } = eachGm;
      const sportDraftPicks = assets?.[selectedSport]?.draftPicks ?? [];

      const filteredDraftPicks = filterOutDraftPicks(sportDraftPicks);
      const newDraftPicksKey = `assets.${selectedSport}.draftPicks`;
      const { modifiedCount } = await gmsCollection.updateOne(
        { name },
        { $set: { [newDraftPicksKey]: filteredDraftPicks } }
      );

      if (modifiedCount === 1) {
        totalGmsCount += modifiedCount;
        console.log(
          `Successfully updated ${name}'s ${selectedSport} draft picks`
        );
      }
    }

    if (totalGmsCount === 16) {
      setSaveMessageText(
        `Successfully updated all GM's ${selectedYear} ${selectedSport} draft picks`
      );
    }
  }, [era, selectedSport, selectedYear]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Remove Completed Draft Picks from GM's Assets</T.Title>
      <U.FlexColumnCentered>
        <S.SectionTitle>Select Sport and Year to Remove</S.SectionTitle>
        <Select
          placeholder="Select Season"
          options={sportYearOptions}
          onChange={handleSelectedSportYear}
          styles={
            isMobile
              ? MobileMatchupsDropdownCustomStyles
              : MatchupsDropdownCustomStyles
          }
          isSearchable={false}
        />
        <U.VerticalSpacer factor={4} />
        <T.FlexColumnCenterContainer>
          <S.SaveButton
            disabled={selectedSport === "" && selectedYear === ""}
            onClick={saveChanges}
          >
            Save
          </S.SaveButton>
          <S.SaveMessageText>{saveMessageText}</S.SaveMessageText>
        </T.FlexColumnCenterContainer>
        <U.VerticalSpacer factor={4} />
        <S.SectionTitle>{`${SAMPLE_GM}'s ${capitalize(
          selectedSport
        )} Draft Picks`}</S.SectionTitle>
        <U.FlexRowStart style={{ alignItems: "end" }}>
          <U.FlexColumnStart style={{ alignItems: "start" }}>
            <S.SectionTitle>Before</S.SectionTitle>
            {beforeFilterDraftPicks.map((draftPick) => {
              return (
                <S.DraftPickText key={draftPick}>{draftPick}</S.DraftPickText>
              );
            })}
          </U.FlexColumnStart>
          <U.HorizontalSpacer factor={8} />
          <U.FlexColumnStart style={{ alignItems: "start" }}>
            <S.SectionTitle>After</S.SectionTitle>
            {afterFilterDraftPicks.map((draftPick) => {
              return (
                <S.DraftPickText key={draftPick}>{draftPick}</S.DraftPickText>
              );
            })}
          </U.FlexColumnStart>
        </U.FlexRowStart>
      </U.FlexColumnCentered>
    </T.FlexColumnCenterContainer>
  );
};
