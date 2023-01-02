import React, { useEffect, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { retrieveAssets } from "./TradeAssetHelper";
import * as S from "styles/TradeAssetDashboard.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";

export const TradeAssetDashboard = () => {
  const { era, gmAbbreviation } = useParams();
  const [gmName, setGmName] = useState("");
  const [assets, setAssets] = useState({});
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ abbreviation: gmAbbreviation });
      const name = gmData?.[0]?.name ?? "";
      setGmName(name);

      const allAssets = await retrieveAssets(
        gmData,
        inSeasonLeagues,
        leagueIdMappings
      );

      const { modifiedCount } = await gmCollection.updateOne(
        { abbreviation: gmAbbreviation },
        { $set: { assets: allAssets } }
      );
      if (modifiedCount < 1) {
        console.log("Did not successfully update document");
      }

      setAssets(allAssets);
    };

    if (isReady) {
      loadData();
    }
  }, [isReady]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>{`Trade Asset Dashboard for ${gmName}`}</T.Title>
      <U.FlexRowCentered>
        {Object.keys(assets).map((sport) => {
          const rosters = assets[sport];
          return (
            <S.SportContainer key={sport}>
              <S.SportTitle>{capitalize(sport)}</S.SportTitle>
              <S.FlexRow>
                <S.PlayersContainer>
                  {rosters.players.map((player) => {
                    return <S.AssetText key={player}>{player}</S.AssetText>;
                  })}
                </S.PlayersContainer>
                <S.DraftPicksContainer>
                  {rosters.draftPicks.map((draftPick) => {
                    return (
                      <S.AssetText key={draftPick}>{draftPick}</S.AssetText>
                    );
                  })}
                </S.DraftPicksContainer>
              </S.FlexRow>
            </S.SportContainer>
          );
        })}
      </U.FlexRowCentered>
    </T.FlexColumnCenterContainer>
  );
};
