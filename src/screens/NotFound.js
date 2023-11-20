import React, { useMemo, useState } from "react";
import { useMediaQuery } from "react-responsive";

import TrifectaBannerGoldTransparent from "resources/images/GoldHorizontalLogo.png";
import * as S from "styles/NotFound.styles";
import * as T from "styles/StandardScreen.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const NotFound = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));

  const verticalFactor = useMemo(() => {
    return isMobile ? 2 : 5;
  }, [isMobile]);
  return (
    <T.FlexColumnCenterContainer>
      <S.HorizontalBanner
        src={TrifectaBannerGoldTransparent}
        alt="trifecta-banner"
      />
      <S.TextContainer>
        <S.ErrorTextCentered style={{ textDecoration: "underline" }}>
          PAGE NOT FOUND
        </S.ErrorTextCentered>
        <S.ErrorTextCentered>Interception! Steal! Error!</S.ErrorTextCentered>
        <G.VerticalSpacer factor={verticalFactor} />
        <S.Subtext>
          Choose your favorite sports metaphor for a mistake and that's how you
          ended up here. To return home, use the menu in the upper left hand
          corner.
        </S.Subtext>
        <G.VerticalSpacer factor={verticalFactor} />
        <S.Subtext>
          But...while you're here, since you like going to random URLs on
          websites, here are links to random Sports Reference pages
        </S.Subtext>
        <G.VerticalSpacer factor={verticalFactor} />
        <S.ReferenceLink
          href="https://www.baseball-reference.com/rand.fcgi"
          target="_blank"
        >
          Baseball Reference
        </S.ReferenceLink>
        <G.VerticalSpacer factor={verticalFactor / 2} />
        <S.ReferenceLink
          href="https://www.basketball-reference.com/rand.fcgi"
          target="_blank"
        >
          Basketball Reference
        </S.ReferenceLink>
        <G.VerticalSpacer factor={verticalFactor / 2} />
        <S.ReferenceLink
          href="https://www.pro-football-reference.com/rand.fcgi"
          target="_blank"
        >
          Football Reference
        </S.ReferenceLink>
      </S.TextContainer>
    </T.FlexColumnCenterContainer>
  );
};
