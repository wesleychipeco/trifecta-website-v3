import React, { useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { components } from "react-select";

import { retrieveAssets } from "./TradeAssetHelper";
import * as S from "styles/TradeAssetDashboard.styles";
import * as T from "styles/Dropdown.styles";

const TRADE_BLOCK_SECTIONS = [
  {
    key: "available",
    text: "Available for Trade",
  },
  {
    key: "seeking",
    text: "Seeking In Return",
  },
  {
    key: "untouchable",
    text: "Untouchable",
  },
];

export const TradeAssetDashboard = () => {
  const { era, gmAbbreviation } = useParams();
  const [gmName, setGmName] = useState("");
  const [tradeBlock, setTradeBlock] = useState({
    available: [],
    seeking: [],
    untouchable: [],
  });
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

      const tradeBlockData = gmData?.[0]?.tradeBlock ?? {};
      console.log("tradeBlockData", tradeBlockData);
      setTradeBlock(tradeBlockData);

      const allAssets = await retrieveAssets(
        gmData,
        inSeasonLeagues,
        leagueIdMappings
      );
      console.log("allassets", allAssets);

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

  const modifyTradeBlock = (section, asset, isAdd) => {
    const oldTradeBlockSection = tradeBlock[section];
    const newTradeBlockSection = isAdd
      ? [...oldTradeBlockSection, asset]
      : oldTradeBlockSection.filter((oldAsset) => oldAsset !== asset);

    const copyTradeBlock = { ...tradeBlock };
    copyTradeBlock[section] = newTradeBlockSection;
    setTradeBlock(copyTradeBlock);
  };

  const addToTradeBlock = (section, player) => {
    modifyTradeBlock(section, player, true);
  };

  const removeFromTradeBlock = (section, asset) => {
    modifyTradeBlock(section, asset, false);
  };

  const addAdd = (event, player) => {
    addToTradeBlock(event.value, player);
  };

  const options = useMemo(
    () =>
      TRADE_BLOCK_SECTIONS.map((section) => ({
        value: section.key,
        label: capitalize(section.key),
      })),
    []
  );

  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon icon="fa-plus" size="lg" />
      </components.DropdownIndicator>
    );
  };

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>{`Trade Asset Dashboard for ${gmName}`}</S.Title>
      <S.OuterTradeBlockContainer>
        <S.Subtitle>Trade Block</S.Subtitle>
        <S.InnerTradeBlockContainer>
          {TRADE_BLOCK_SECTIONS.map((section) => {
            const keyName = section.key;
            return (
              <S.TradeBlockSection key={section.key}>
                <S.SportTitle>{section.text}</S.SportTitle>
                <S.TradeBlockDisplaySection>
                  {tradeBlock[keyName].map((asset) => {
                    return (
                      <S.AssetContainer key={asset}>
                        <S.AssetText>{asset}</S.AssetText>
                        <S.XIconContainer>
                          <FontAwesomeIcon
                            icon="fa-circle-xmark"
                            size="lg"
                            onClick={() =>
                              removeFromTradeBlock(section.key, asset)
                            }
                          />
                        </S.XIconContainer>
                      </S.AssetContainer>
                    );
                  })}
                </S.TradeBlockDisplaySection>
                <S.TradeBlockWriteSection>Two</S.TradeBlockWriteSection>
              </S.TradeBlockSection>
            );
          })}
        </S.InnerTradeBlockContainer>
      </S.OuterTradeBlockContainer>
      <S.AllAssetsContainer>
        {Object.keys(assets).map((sport) => {
          const rosters = assets[sport];
          return (
            <S.SportContainer key={sport}>
              <S.SportTitle>{capitalize(sport)}</S.SportTitle>
              <S.FaabText>{`FAAB remaining: ${rosters.faab}`}</S.FaabText>
              <S.FlexRow>
                <S.PlayersContainer>
                  {rosters.players.map((player) => {
                    return (
                      <S.AssetContainer key={player}>
                        <Select
                          placeholder=""
                          defaultValue=""
                          onChange={(e) => addAdd(e, player)}
                          options={options}
                          components={{ DropdownIndicator }}
                          styles={T.TradeBlockDropdownCustomStyles}
                          isSearchable={false}
                        />
                        <S.AssetText>{player}</S.AssetText>
                      </S.AssetContainer>
                    );
                  })}
                </S.PlayersContainer>
                <S.DraftPicksContainer>
                  {rosters.draftPicks.map((draftPick) => {
                    return (
                      <S.AssetContainer key={draftPick}>
                        <S.AssetText>{draftPick}</S.AssetText>
                      </S.AssetContainer>
                    );
                  })}
                </S.DraftPicksContainer>
              </S.FlexRow>
            </S.SportContainer>
          );
        })}
      </S.AllAssetsContainer>
    </S.FlexColumnCenterContainer>
  );
};
