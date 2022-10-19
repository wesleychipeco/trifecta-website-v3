import React from "react";
import * as S from "./HallOfFame.styles";

import { STATIC_ROUTES } from "../../Routes";
import { Button } from "../../components/button/Button";
import { OwnerLinks } from "./OwnerLinks";

export const HallOfFame = () => {
  return (
    <S.FlexColumnCenterContainer>
      <S.Title>Trifecta Fantasy League Hall of Fame</S.Title>
      <S.ChampionsContainer>
        <S.ChampionsTextContainer>
          <S.LabelText>Trifecta</S.LabelText>
          <br />
          <S.LabelText>Champions</S.LabelText>
        </S.ChampionsTextContainer>
        <S.ChampionsColumn>
          <S.Champion>
            <S.ChampionsText>Season 1: 2015 - 2016</S.ChampionsText>
            <S.ChampionsText>Joshua Apostol - 27.5 points</S.ChampionsText>
          </S.Champion>
          <S.Champion>
            <S.ChampionsText>Season 2: 2016 - 2017</S.ChampionsText>
            <S.ChampionsText>Ryan Tomimitsu - 32.5 points</S.ChampionsText>
          </S.Champion>
          <S.Champion>
            <S.ChampionsText>Season 3: 2017 - 2018</S.ChampionsText>
            <S.ChampionsText>Marcus Lam - 57 points</S.ChampionsText>
          </S.Champion>
        </S.ChampionsColumn>
        <S.ChampionsColumn>
          <S.Champion>
            <S.ChampionsText>Season 4: 2018 - 2019</S.ChampionsText>
            <S.ChampionsText>Joshua Liu - 54 points</S.ChampionsText>
          </S.Champion>
          <S.Champion>
            <S.ChampionsText>Season 5: 2019 - 2020</S.ChampionsText>
            <S.ChampionsText>Wesley Chipeco - 56.5 points</S.ChampionsText>
          </S.Champion>
          <S.Champion>
            <S.ChampionsText>Season 6: 2020 - 2021</S.ChampionsText>
            <S.ChampionsText>
              Joshua Apostol & Wesley Chipeco - 51 points
            </S.ChampionsText>
          </S.Champion>
        </S.ChampionsColumn>
      </S.ChampionsContainer>
      <S.HallOfFameContainer>
        <S.HallOfFameLabelTextContainer>
          <S.LabelText>By Sport</S.LabelText>
        </S.HallOfFameLabelTextContainer>
        <Button
          title={"Basketball Hall of Fame"}
          navTo={STATIC_ROUTES.BasketballHallOfFame}
        />
        <Button
          title={"Baseball Hall of Fame"}
          navTo={STATIC_ROUTES.BaseballHallOfFame}
        />
        <Button
          title={"Football Hall of Fame"}
          navTo={STATIC_ROUTES.FootballHallOfFame}
        />
      </S.HallOfFameContainer>
      <S.OwnerProfilesContainer>
        <S.OwnerProfilesLabelTextContainer>
          <S.LabelText>By Owner</S.LabelText>
        </S.OwnerProfilesLabelTextContainer>
        <S.OwnerProfilesColumnContainer column={1}>
          <OwnerLinks name="Marcus Lam" />
          <OwnerLinks name="Wesley Chipeco" />
          <OwnerLinks name="Kevin Okamoto & Joshua Liu" />
          <OwnerLinks name="Bryan Kuh" />
          <OwnerLinks name="Joshua Apostol" />
        </S.OwnerProfilesColumnContainer>
        <S.OwnerProfilesColumnContainer column={2}>
          <OwnerLinks name="Joshua Aguirre" />
          <OwnerLinks name="Tim Fong" />
          <OwnerLinks name="Ryan Tomimitsu" />
          <OwnerLinks name="Nick Wang" />
          <OwnerLinks name="Wayne Fong" />
        </S.OwnerProfilesColumnContainer>
        <S.OwnerProfilesColumnContainer column={3}>
          <OwnerLinks name="Joshua Liu" />
          <OwnerLinks name="Nick Wang & Kevin Okamoto" />
          <OwnerLinks name="Katie Yamamoto" />
          <OwnerLinks name="Tim Fong & Wayne Fong" />
        </S.OwnerProfilesColumnContainer>
      </S.OwnerProfilesContainer>
    </S.FlexColumnCenterContainer>
  );
};
