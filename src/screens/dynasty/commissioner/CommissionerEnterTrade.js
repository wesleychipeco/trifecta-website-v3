import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";
import { returnMongoCollection } from "database-management";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as S from "styles/Commissioner.styles";
import * as T from "styles/StandardScreen.styles";
import * as U from "styles/shared";
import {
  MatchupsDropdownCustomStyles,
  MobileMatchupsDropdownCustomStyles,
} from "styles/Dropdown.styles";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const CommissionerEnterTrade = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));

  // set up local state
  const [gmsArray, setGmsArray] = useState([]);
  const [date, setDate] = useState("");
  const [gms, setGms] = useState({
    gm1: "",
    gm2: "",
  });
  const [assets, setAssets] = useState({
    assets1: [],
    assets2: [],
  });
  const [manualInputs, setManualInputs] = useState({
    assets1: "",
    assets2: "",
  });
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // methods to handle manual input assets
  const modifyAssets = (key, asset, isAdd) => {
    const oldAssetsSection = assets[key];
    const newAssetsSection = isAdd
      ? [...oldAssetsSection, asset]
      : oldAssetsSection.filter((oldAsset) => oldAsset !== asset);

    const copyAssets = { ...assets };
    copyAssets[key] = newAssetsSection;
    setAssets(copyAssets);
  };

  const addToAssets = (key, asset) => {
    modifyAssets(key, asset, true);
  };

  const removeFromAssets = (key, asset) => {
    modifyAssets(key, asset, false);
  };

  // manual text input functions
  const onChangeDate = (event) => {
    setDate(event.target.value);
  };

  const onChangeHandler = (key, event) => {
    const copyManualInputs = { ...manualInputs };
    copyManualInputs[key] = event.target.value;
    setManualInputs(copyManualInputs);
  };

  const addFromManualInput = (key) => {
    const assetToAdd = manualInputs[key];
    addToAssets(key, assetToAdd);

    const copyManualInputs = { ...manualInputs };
    copyManualInputs[key] = "";
    setManualInputs(copyManualInputs);
  };

  // methods to handle GM dropdown changes
  const handleGM1Change = (selectedOption) => {
    const copyGms = { ...gms };
    copyGms["gm1"] = selectedOption?.value ?? "";
    setGms(copyGms);
  };

  const handleGM2Change = (selectedOption) => {
    const copyGms = { ...gms };
    copyGms["gm2"] = selectedOption?.value ?? "";
    setGms(copyGms);
  };

  // functions to save trade block to mongodb
  const timeoutSaveMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => {
      setSaveMessage("");
    }, 3000);
  };

  const saveTrade = async () => {
    const tradeHistoryCollection = await returnMongoCollection(
      "tradeHistory",
      era
    );
    const tradeObject = {
      date,
      owner1: gms["gm1"],
      owner1PlayersReceived: assets["assets1"],
      owner2: gms["gm2"],
      owner2PlayersReceived: assets["assets2"],
    };

    await tradeHistoryCollection.insertOne(tradeObject);

    timeoutSaveMessage("Trade saved successfully!");
    setIsSaveButtonEnabled(false);
    setDate("");
    setGms({
      gm1: "",
      gm2: "",
    });
    setAssets({
      assets1: [],
      assets2: [],
    });
    setManualInputs({
      assets1: "",
      assets2: "",
    });
  };

  // load data on page load
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

  useEffect(() => {
    const enableSave =
      date.length > 0 &&
      gms["gm1"].length > 0 &&
      gms["gm2"].length > 0 &&
      assets["assets1"].length > 0 &&
      assets["assets2"].length > 0;

    setIsSaveButtonEnabled(enableSave);
  }, [gms, assets, date]);

  const options = useMemo(() => {
    return gmsArray.map((gm) => ({
      value: gm,
      label: gm,
    }));
  }, [gmsArray]);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Enter Trade</T.Title>
      <S.EnterTradeDateContainer>
        <S.SectionTitle>Date</S.SectionTitle>
        <S.ManualInput
          type="text"
          name="date"
          placeholder="Enter date (ex: 2023/08/31)"
          onChange={(e) => onChangeDate(e)}
          value={date}
        />
        <S.EnterTradeSaveButton
          disabled={!isSaveButtonEnabled}
          onClick={saveTrade}
        >
          Save
        </S.EnterTradeSaveButton>
        <S.EnterTradeSaveMessageText>{saveMessage}</S.EnterTradeSaveMessageText>
      </S.EnterTradeDateContainer>
      <S.EnterTradeRowContainer>
        <S.EnterTradeGMContainer>
          <S.SectionTitle>GM 1</S.SectionTitle>
          <U.VerticalSpacer factor={6} />
          <Select
            placeholder="Select GM"
            defaultValue={gms["gm1"]}
            onChange={handleGM1Change}
            options={options}
            styles={
              isMobile
                ? MobileMatchupsDropdownCustomStyles
                : MatchupsDropdownCustomStyles
            }
            isSearchable={false}
          />
        </S.EnterTradeGMContainer>

        <U.HorizontalSpacer factor={2} />

        <S.EnterTradeAssetContainer>
          <S.SectionTitle>GM 1 Assets Received</S.SectionTitle>
          <U.FlexRow>
            <S.ManualInput
              type="text"
              name="assets1"
              placeholder="Manually enter assets here..."
              onChange={(e) => onChangeHandler("assets1", e)}
              value={manualInputs["assets1"]}
            />
            <S.AddManualInputButton
              onClick={() => addFromManualInput("assets1")}
            >
              Add
            </S.AddManualInputButton>
          </U.FlexRow>
          {assets["assets1"].map((asset) => {
            return (
              <S.AssetContainer key={asset}>
                <p>{asset}</p>
                <S.XIconContainer>
                  <FontAwesomeIcon
                    icon="fa-circle-xmark"
                    size={isMobile ? "md" : "lg"}
                    onClick={() => removeFromAssets("assets1", asset)}
                  />
                </S.XIconContainer>
              </S.AssetContainer>
            );
          })}
        </S.EnterTradeAssetContainer>

        <U.HorizontalSpacer factor={8} />

        <S.EnterTradeGMContainer>
          <S.SectionTitle>GM 2</S.SectionTitle>
          <U.VerticalSpacer factor={6} />
          <Select
            placeholder="Select GM"
            defaultValue={gms["gm2"]}
            onChange={handleGM2Change}
            options={options}
            styles={
              isMobile
                ? MobileMatchupsDropdownCustomStyles
                : MatchupsDropdownCustomStyles
            }
            isSearchable={false}
          />
        </S.EnterTradeGMContainer>

        <U.HorizontalSpacer factor={2} />

        <S.EnterTradeAssetContainer>
          <S.SectionTitle>GM 2 Assets Received</S.SectionTitle>
          <U.FlexRow>
            <S.ManualInput
              type="text"
              name="assets2"
              placeholder="Manually enter assets here..."
              onChange={(e) => onChangeHandler("assets2", e)}
              value={manualInputs["assets2"]}
            />
            <S.AddManualInputButton
              onClick={() => addFromManualInput("assets2")}
            >
              Add
            </S.AddManualInputButton>
          </U.FlexRow>
          {assets["assets2"].map((asset) => {
            return (
              <S.AssetContainer key={asset}>
                <p>{asset}</p>
                <S.XIconContainer>
                  <FontAwesomeIcon
                    icon="fa-circle-xmark"
                    size={isMobile ? "md" : "lg"}
                    onClick={() => removeFromAssets("assets2", asset)}
                  />
                </S.XIconContainer>
              </S.AssetContainer>
            );
          })}
        </S.EnterTradeAssetContainer>
      </S.EnterTradeRowContainer>
    </T.FlexColumnCenterContainer>
  );
};
