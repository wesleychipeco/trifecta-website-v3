import * as S from "./HomeScreen.styles";

import BaseballPhoto from "resources/images/Baseball.jpg";
import BasketballPhoto from "resources/images/Basketball.jpg";
import FootballPhoto from "resources/images/Football.jpg";
import TrifectaTrophy from "resources/images/TrifectaTrophy.png";
import { CSSTransition } from "react-transition-group";
import "./transition.styles.css";
import { useEffect, useState } from "react";

export const HomeScreen = () => {
  const [show, setShow] = useState(false);
  const [showDelay, setShowDelay] = useState(false);

  useEffect(() => {
    setShow(true);
    setTimeout(() => {
      setShowDelay(true);
    }, 1000);
  }, []);

  return (
    <S.HomeContainer>
      <S.TitleContainer>
        <S.TitleText>Trifecta Fantasy League</S.TitleText>
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
        timeout={2000}
        classNames="trophy"
        unmountOnExit
      >
        <S.Trophy src={TrifectaTrophy} alt="trifecta-trophy" />
      </CSSTransition>
    </S.HomeContainer>
  );
};
