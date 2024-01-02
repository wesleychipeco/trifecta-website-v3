import React, { useEffect, useState } from "react";
import { sortBy } from "lodash";
import { useMediaQuery } from "react-responsive";
import * as S from "styles/HallOfFame.styles";
import * as T from "styles/shared";

import { STATIC_ROUTES } from "Routes";
import { Button } from "components/button/Button";
import { OwnerLinks } from "./OwnerLinks";
import { returnMongoCollection } from "database-management";
import { StandingsDropdown } from "components/dropdown/StandingsDropdown";
import { splitInto2Arrays, splitIntoArraysOfLengthX } from "utils/arrays";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const HallOfFame = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [sortedYearsArray, setSortedYearsArray] = useState([]);
  const [pastChampions, setPastChampions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const trifectaCollection = await returnMongoCollection(
        "trifectaStandings"
      );
      const yearsData = await trifectaCollection.find({});

      // remove years that are not 4 characters & dedupe (test/backup files)
      const filteredYears = yearsData
        .filter((eachYear) => eachYear.year.length === 4)
        .map((each1) => each1.year);
      const yearsArray = sortBy([...new Set(filteredYears)]);
      const comboYearsArray = isMobile
        ? splitIntoArraysOfLengthX(yearsArray, 2)
        : splitInto2Arrays(yearsArray);
      setSortedYearsArray(comboYearsArray);

      const hallOfFameCollection = await returnMongoCollection("hallOfFame");
      const championsData = await hallOfFameCollection.find({
        type: "pastChampions",
      });
      const pc = championsData?.[0]?.pastChampions ?? [];
      const comboChampionsArray = splitInto2Arrays(pc);
      setPastChampions(comboChampionsArray);
    };

    fetchData();
  }, [isMobile]);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>Trifecta Fantasy League Hall of Fame</S.Title>
      <S.ChampionsContainer>
        <S.ChampionsTextContainer>
          <S.LabelText>Trifecta</S.LabelText>
          <T.VerticalSpacer factor={1} />
          <S.LabelText>Champions</S.LabelText>
        </S.ChampionsTextContainer>
        <T.HorizontalSpacer factor={4} />
        {pastChampions.map((pastChamionColumn, i) => {
          return (
            <S.ChampionsColumn key={i}>
              {pastChamionColumn.map((champ) => {
                return (
                  <S.Champion key={champ.season}>
                    <S.ChampionsText>{`Season ${champ.season}: ${champ.years}`}</S.ChampionsText>
                    <S.ChampionsText>{champ.winner}</S.ChampionsText>
                  </S.Champion>
                );
              })}
            </S.ChampionsColumn>
          );
        })}
      </S.ChampionsContainer>
      <S.HallOfFameContainer>
        <S.ButtonsContainer>
          <S.HallOfFameLabelTextContainer>
            <S.LabelText>By Year</S.LabelText>
          </S.HallOfFameLabelTextContainer>
          <S.StandingsColumnContainer>
            {sortedYearsArray.map((row, i) => {
              return (
                <S.StandingsRowContainer key={i}>
                  {row.map((year) => {
                    return <StandingsDropdown key={year} year={year} />;
                  })}
                </S.StandingsRowContainer>
              );
            })}
          </S.StandingsColumnContainer>
        </S.ButtonsContainer>
      </S.HallOfFameContainer>
      <S.BySportHallOfFameContainer>
        <S.ButtonsContainer>
          <S.HallOfFameLabelTextContainer>
            <S.LabelText>By Sport</S.LabelText>
          </S.HallOfFameLabelTextContainer>
          {!isMobile && <T.HorizontalSpacer factor={6} />}
          <Button
            title={"Basketball Hall of Fame"}
            navTo={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.BasketballHallOfFame}`}
          />
          {isMobile && <T.VerticalSpacer factor={3} />}
          {!isMobile && <T.HorizontalSpacer factor={4} />}
          <Button
            title={"Baseball Hall of Fame"}
            navTo={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.BaseballHallOfFame}`}
          />
          {isMobile && <T.VerticalSpacer factor={3} />}
          {!isMobile && <T.HorizontalSpacer factor={4} />}
          <Button
            title={"Football Hall of Fame"}
            navTo={`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.FootballHallOfFame}`}
          />
        </S.ButtonsContainer>
      </S.BySportHallOfFameContainer>
      <S.OwnerProfilesContainer>
        <S.OwnerProfilesLabelTextContainer>
          <S.LabelText>By Owner</S.LabelText>
        </S.OwnerProfilesLabelTextContainer>
        {isMobile ? (
          <S.OwnerProfilesColumnContainer column={1}>
            <OwnerLinks name="Marcus Lam" teamNumber={1} />
            <OwnerLinks name="Wesley Chipeco" teamNumber={2} />
            <OwnerLinks name="Kevin Okamoto & Joshua Liu" teamNumber={3} />
            <OwnerLinks name="Bryan Kuh" teamNumber={4} />
            <OwnerLinks name="Joshua Apostol" teamNumber={5} />
            <OwnerLinks name="Joshua Aguirre" teamNumber={6} />
            <OwnerLinks name="Tim Fong" teamNumber={7} />
            <OwnerLinks name="Ryan Tomimitsu" teamNumber={8} />
            <OwnerLinks name="Nick Wang" teamNumber={9} />
            <OwnerLinks name="Wayne Fong" teamNumber={10} />
            <OwnerLinks name="Joshua Liu" teamNumber={11} />
            <OwnerLinks name="Nick Wang & Kevin Okamoto" teamNumber={12} />
            <OwnerLinks name="Katie Yamamoto" teamNumber={13} />
            <OwnerLinks name="Tim Fong & Wayne Fong" teamNumber={14} />
          </S.OwnerProfilesColumnContainer>
        ) : (
          <>
            <S.OwnerProfilesColumnContainer column={1}>
              <OwnerLinks name="Marcus Lam" teamNumber={1} />
              <OwnerLinks name="Wesley Chipeco" teamNumber={2} />
              <OwnerLinks name="Kevin Okamoto & Joshua Liu" teamNumber={3} />
              <OwnerLinks name="Bryan Kuh" teamNumber={4} />
              <OwnerLinks name="Joshua Apostol" teamNumber={5} />
            </S.OwnerProfilesColumnContainer>
            <S.OwnerProfilesColumnContainer column={2}>
              <OwnerLinks name="Joshua Aguirre" teamNumber={6} />
              <OwnerLinks name="Tim Fong" teamNumber={7} />
              <OwnerLinks name="Ryan Tomimitsu" teamNumber={8} />
              <OwnerLinks name="Nick Wang" teamNumber={9} />
              <OwnerLinks name="Wayne Fong" teamNumber={10} />
            </S.OwnerProfilesColumnContainer>
            <S.OwnerProfilesColumnContainer column={3}>
              <OwnerLinks name="Joshua Liu" teamNumber={11} />
              <OwnerLinks name="Nick Wang & Kevin Okamoto" teamNumber={12} />
              <OwnerLinks name="Katie Yamamoto" teamNumber={13} />
              <OwnerLinks name="Tim Fong & Wayne Fong" teamNumber={14} />
            </S.OwnerProfilesColumnContainer>
          </>
        )}
      </S.OwnerProfilesContainer>
    </S.FlexColumnCenterContainer>
  );
};
