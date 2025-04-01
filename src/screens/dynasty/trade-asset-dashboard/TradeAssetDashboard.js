import React, { useEffect, useMemo, useState } from "react";
import { returnMongoCollection } from "database-management";
import { capitalize, upperCase } from "lodash";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select, { components } from "react-select";
import { useAuth0 } from "@auth0/auth0-react";
import { useMediaQuery } from "react-responsive";
import ReactGA from "react-ga4";

import * as S from "styles/TradeAssetDashboard.styles";
import * as T from "styles/Dropdown.styles";
import * as U from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";
import { BASEBALL } from "Constants";

const ALL_TRADE_BLOCK_SECTIONS = [
  {
    key: "available",
    text: "Available for Trade",
  },
  {
    key: "seeking",
    text: "Seeking in Return",
  },
  {
    key: "untouchable",
    text: "Untouchable",
  },
];

const ASSIGNABLE_TRADE_BLOCK_SECTIONS = [
  {
    key: "available",
    text: "Available for Trade",
  },
  {
    key: "untouchable",
    text: "Untouchable",
  },
];

export const TradeAssetDashboard = () => {
  // setup
  const { era, gmAbbreviation } = useParams();
  const [gmName, setGmName] = useState("");
  const [tradeBlock, setTradeBlock] = useState({
    available: [],
    seeking: [],
    untouchable: [],
  });
  const [assets, setAssets] = useState({});
  const [saveMessage, setSaveMessage] = useState("");
  const [manualInputs, setManualInputs] = useState({
    available: "",
    seeking: "",
    untouchable: "",
  });
  const [hasEditAccess, setHasEditAccess] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const { inSeasonLeagues, leagueIdMappings } = useSelector(
    (state) => state?.currentVariables?.seasonVariables?.dynasty
  );
  const { isAuthenticated, user } = useAuth0();
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [lastUpdatedDay, setLastUpdatedDay] = useState("");

  // load data on page ready
  useEffect(() => {
    const display = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ abbreviation: gmAbbreviation });
      const gm = gmData?.[0];
      const name = gm?.name ?? "";
      setGmName(name);

      if (isAuthenticated) {
        const emails = gm?.emails ?? [];
        setHasEditAccess(emails.includes(user.email));
      }

      const tradeBlockData = gm?.tradeBlock ?? {};
      // console.log("tradeBlockData", tradeBlockData);
      setTradeBlock(tradeBlockData);

      const assets = gm?.assets ?? {};
      // console.log("allAssets", assets);
      setAssets(assets);

      const lastUpdatedDate =
        assets?.basketball?.lastUpdated ?? assets?.baseball?.lastUpdated;
      console.log(
        `${gmAbbreviation} Trade Asset Dashboard last scraped (Local Time): ${lastUpdatedDate}`
      );

      if (lastUpdatedDate) {
        const lastUpdatedIndex = lastUpdatedDate.indexOf(",");
        const lastUpdatedDay = lastUpdatedDate.substring(0, lastUpdatedIndex);
        setLastUpdatedDay(lastUpdatedDay);
      }
    };

    if (isReady) {
      display();
    }
  }, [
    isReady,
    user,
    era,
    gmAbbreviation,
    inSeasonLeagues,
    isAuthenticated,
    leagueIdMappings,
  ]);

  // options for select dropdown
  const options = useMemo(
    () =>
      ASSIGNABLE_TRADE_BLOCK_SECTIONS.map((section) => ({
        value: section.key,
        label: capitalize(section.key),
      })),
    []
  );

  // functions to correctly modify the immutable state
  const modifyTradeBlock = (section, asset, isAdd) => {
    const oldTradeBlockSection = tradeBlock[section];
    const newTradeBlockSection = isAdd
      ? [...oldTradeBlockSection, asset]
      : oldTradeBlockSection.filter((oldAsset) => oldAsset !== asset);

    const copyTradeBlock = { ...tradeBlock };
    copyTradeBlock[section] = newTradeBlockSection;
    setTradeBlock(copyTradeBlock);
    setIsSaveButtonEnabled(true);
  };

  const addToTradeBlock = (section, player) => {
    modifyTradeBlock(section, player, true);
  };

  const removeFromTradeBlock = (section, asset) => {
    modifyTradeBlock(section, asset, false);
  };

  const addPlayer = (event, player) => {
    addToTradeBlock(event.value, player);
  };

  // manual text input functions
  const onChangeHandler = (section, event) => {
    const copyManualInputs = { ...manualInputs };
    copyManualInputs[section] = event.target.value;
    setManualInputs(copyManualInputs);
  };

  const addFromManualInput = (section) => {
    const assetToAdd = manualInputs[section];
    addToTradeBlock(section, assetToAdd);

    const copyManualInputs = { ...manualInputs };
    copyManualInputs[section] = "";
    setManualInputs(copyManualInputs);
  };

  // custom dropdown indicator for react-select using font awesome icon
  const DropdownIndicator = (props) => {
    return (
      <components.DropdownIndicator {...props}>
        <FontAwesomeIcon icon="fa-plus" size={isMobile ? "md" : "lg"} />
      </components.DropdownIndicator>
    );
  };

  // functions to save trade block to mongodb
  const timeoutSaveMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const saveTradeBlock = async () => {
    ReactGA.event({
      category: "tradeBlock",
      action: "save",
      label: "save trade block",
    });
    const gmCollection = await returnMongoCollection("gms", era);
    // console.log("FINAL TRADE BLOCK", tradeBlock);

    const { modifiedCount } = await gmCollection.updateOne(
      { abbreviation: gmAbbreviation },
      { $set: { tradeBlock } }
    );
    if (modifiedCount < 1) {
      timeoutSaveMessage("Did NOT successfully update trade block!");
    } else if (modifiedCount === 1) {
      timeoutSaveMessage("Trade block saved successfully!");
      setIsSaveButtonEnabled(false);
    }
  };

  return (
    <S.FlexColumnCenterContainer>
      <S.Title
        style={{ marginBottom: "0.5rem" }}
      >{`Trade Asset Dashboard for ${gmName} (${upperCase(
        gmAbbreviation
      )})`}</S.Title>
      {lastUpdatedDay && (
        <>
          <G.FlexRowCentered>
            <U.LastUpdatedTime style={{ fontWeight: 800 }}>
              Last Updated:{" "}
            </U.LastUpdatedTime>
            <G.HorizontalSpacer factor={1} />
            <U.LastUpdatedTime>{lastUpdatedDay}</U.LastUpdatedTime>
          </G.FlexRowCentered>
          <G.VerticalSpacer factor={2} />
        </>
      )}
      <S.OuterTradeBlockContainer>
        <S.Subtitle>TRADE BLOCK</S.Subtitle>
        <S.SaveMessageText>{saveMessage}</S.SaveMessageText>
        {hasEditAccess && (
          <S.SaveButton
            disabled={!isSaveButtonEnabled}
            onClick={saveTradeBlock}
          >
            Save
          </S.SaveButton>
        )}
        <S.InnerTradeBlockContainer>
          {ALL_TRADE_BLOCK_SECTIONS.map((section) => {
            const keyName = section.key;
            return (
              <S.TradeBlockSection key={section.key}>
                <S.SectionTitle>{section.text}</S.SectionTitle>
                <S.TradeBlockDisplaySection>
                  {tradeBlock[keyName].map((asset) => {
                    return (
                      <S.AssetContainer key={asset}>
                        <S.AssetText>{`+ ${asset}`}</S.AssetText>
                        {hasEditAccess && (
                          <S.XIconContainer>
                            <FontAwesomeIcon
                              icon="fa-circle-xmark"
                              size={isMobile ? "md" : "lg"}
                              onClick={() =>
                                removeFromTradeBlock(section.key, asset)
                              }
                            />
                          </S.XIconContainer>
                        )}
                      </S.AssetContainer>
                    );
                  })}
                </S.TradeBlockDisplaySection>
                {hasEditAccess && (
                  <S.TradeBlockWriteSection>
                    <S.ManualInput
                      type="text"
                      name={section.key}
                      placeholder="Manually enter assets here..."
                      onChange={(e) => onChangeHandler(section.key, e)}
                      value={manualInputs[section.key]}
                    />
                    <S.AddManualInputButton
                      onClick={() => addFromManualInput(section.key)}
                    >
                      Add
                    </S.AddManualInputButton>
                  </S.TradeBlockWriteSection>
                )}
              </S.TradeBlockSection>
            );
          })}
        </S.InnerTradeBlockContainer>
      </S.OuterTradeBlockContainer>
      <S.OuterTradeBlockContainer>
        <S.Subtitle>AVAILABLE ASSETS</S.Subtitle>
      </S.OuterTradeBlockContainer>
      <S.AllAssetsContainer>
        {Object.keys(assets).map((sport) => {
          const rosters = assets[sport];
          return (
            <S.SportContainer key={sport}>
              <S.SectionTitle>{capitalize(sport)}</S.SectionTitle>
              <S.FaabText>{`FAAB remaining: ${rosters.faab}`}</S.FaabText>
              {sport === BASEBALL && (
                <S.FaabText>* denotes Minor League eligible player</S.FaabText>
              )}
              <S.FlexRow>
                <S.PlayersContainer>
                  {rosters.players.map((player) => {
                    return (
                      <S.AssetContainer key={player}>
                        {hasEditAccess && (
                          <Select
                            placeholder=""
                            defaultValue=""
                            onChange={(e) => addPlayer(e, player)}
                            options={options}
                            components={{ DropdownIndicator }}
                            styles={T.TradeBlockDropdownCustomStyles}
                            isSearchable={false}
                          />
                        )}
                        <S.AssetText>{`+ ${player}`}</S.AssetText>
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
