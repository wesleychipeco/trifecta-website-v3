import * as S from "styles/HomeScreen.styles";

import BaseballPhoto from "resources/images/Baseball.jpg";
import BasketballPhoto from "resources/images/Basketball.jpg";
import FootballPhoto from "resources/images/Football.jpg";
import TrifectaTrophy from "resources/images/TrifectaTrophy.png";
import { CSSTransition } from "react-transition-group";
import "./transition.styles.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { STATIC_ROUTES } from "Routes";
import { ERA_1 } from "Constants";

import TrifectaBannerGoldTransparent from "resources/images/GoldHorizontalLogo.png";
import { MOBILE_MAX_WIDTH } from "styles/global";

export const HomeScreen = () => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));
  const [show, setShow] = useState(false);
  const [showDelay, setShowDelay] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShowDelay(true);
    }, 500);

    if (!location.pathname.startsWith("/trifecta")) {
      setTimeout(() => {
        navigate(`${STATIC_ROUTES.DynastyHome}/${ERA_1}`);
      }, 4000);
    } else {
      setTimeout(() => {
        navigate(`${STATIC_ROUTES.TrifectaHome}/${STATIC_ROUTES.HallOfFame}`);
      }, 4000);
    }
  }, [isMobile, location.pathname, navigate]);

  return (
    <S.HomeContainer>
      <S.TitleContainer>
        <CSSTransition
          in={show}
          timeout={3000}
          classNames="banner"
          unmountOnExit
        >
          <S.HorizontalBanner
            src={TrifectaBannerGoldTransparent}
            alt="banner"
          />
        </CSSTransition>
      </S.TitleContainer>
      <S.ImageOpacity>
        <CSSTransition
          in={show}
          timeout={3000}
          classNames="basketball"
          unmountOnExit
        >
          <S.Basketball src={BasketballPhoto} alt="basketball" />
        </CSSTransition>
        <CSSTransition
          in={show}
          timeout={3000}
          classNames="baseball"
          unmountOnExit
        >
          <S.Baseball src={BaseballPhoto} alt="baseball" />
        </CSSTransition>
        <CSSTransition
          in={show}
          timeout={3000}
          classNames="football"
          unmountOnExit
        >
          <S.Football src={FootballPhoto} alt="football" />
        </CSSTransition>
      </S.ImageOpacity>
      <CSSTransition
        in={showDelay}
        timeout={2500}
        classNames="trophy"
        unmountOnExit
      >
        <S.Trophy src={TrifectaTrophy} alt="trifecta-trophy" />
      </CSSTransition>
    </S.HomeContainer>
  );
};
