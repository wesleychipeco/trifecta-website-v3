import { returnMongoCollection } from "database-management";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "components/button/Button";
import { upperCase } from "lodash";
import { STATIC_ROUTES } from "Routes";
import { splitIntoArraysOfLengthX } from "utils/arrays";
import * as S from "styles/TradeAssetDashboard.styles";
import * as T from "styles/StandardScreen.styles";

export const TradeAssetHome = () => {
  const { era } = useParams();
  const isReady = useSelector((state) => state?.currentVariables?.isReady);
  const [gms, setGms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const gmCollection = await returnMongoCollection("gms", era);
      const gmData = await gmCollection.find({ test: { $ne: true } });
      const pickedGmData = gmData.map((gm) => ({
        name: gm.name,
        abbreviation: gm.abbreviation,
      }));

      const splitGmData = splitIntoArraysOfLengthX(pickedGmData, 4);
      setGms(splitGmData);
    };

    loadData();
  }, [isReady]);

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
      </S.TradeAssetHomeContainer>
    </T.FlexColumnCenterContainer>
  );
};
