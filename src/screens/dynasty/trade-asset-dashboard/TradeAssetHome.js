import { returnMongoCollection } from "database-management";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { Button } from "components/button/Button";
import { flatten, upperCase } from "lodash";
import { STATIC_ROUTES } from "Routes";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import * as S from "styles/TradeAssetDashboard.styles";
import * as T from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const TradeAssetHome = () => {
  const { era } = useParams();
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [gms, setGms] = useState([]);
  const [availableForTrade, setAvailableForTrade] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ test: { $ne: true } });
      console.log("gmdata", gmData);
      // for gm buttons
      const pickedGmData = gmData.map((gm) => ({
        name: gm.name,
        abbreviation: gm.abbreviation,
      }));

      const splitGmData = splitIntoArraysOfLengthX(pickedGmData, 4);
      setGms(splitGmData);

      // for trade block availble scroller
      const rawAvailable = gmData.map((gm) => {
        if (gm.tradeBlock.available.length === 0) {
          return "";
        }
        return gm.tradeBlock.available.map((eachAvailable) => {
          return `+ ${eachAvailable} (${gm.abbreviation})`;
        });
      });

      const filteredOutAvailable = rawAvailable.filter((each) => each !== "");
      const flattenedFiltered = flatten(filteredOutAvailable);
      const splitAvailable = splitIntoArraysOfLengthX(
        flattenedFiltered,
        isMobile ? 2 : 4
      );
      setAvailableForTrade(splitAvailable);
    };

    loadData();
  }, [isReady, era]);
  console.log("SSSSS", availableForTrade);

  return (
    <T.FlexColumnCenterContainer>
      <T.Title>Trade Asset Home Page</T.Title>
      <S.TradeAssetHomeContainer>
        {gms.map((row, i) => {
          return (
            <S.TradeAssetHomeRowContainer key={i}>
              {row.map((gm) => {
                return (
                  <Button
                    key={gm.name}
                    title={`${gm.name} (${upperCase(gm.abbreviation)})`}
                    navTo={`${STATIC_ROUTES.DynastyHome}/${era}/trade-asset-dashboard/${gm.abbreviation}`}
                  />
                );
              })}
            </S.TradeAssetHomeRowContainer>
          );
        })}
        <G.VerticalSpacer factor={10} />
        <S.TradeAssetHomeAvailableAssetsTitle>
          All Assets Available for Trade
        </S.TradeAssetHomeAvailableAssetsTitle>
        <S.TradeAssetHomeAvailableOuter>
          {availableForTrade.map((row, i) => {
            return (
              <S.TradeAssetHomeAvailableRow key={i}>
                {row.map((eachItem, j) => {
                  return (
                    <S.TradeAssetHomeAvailableText key={j} isMobile={isMobile}>
                      {eachItem}
                    </S.TradeAssetHomeAvailableText>
                  );
                })}
              </S.TradeAssetHomeAvailableRow>
            );
          })}
        </S.TradeAssetHomeAvailableOuter>
      </S.TradeAssetHomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
