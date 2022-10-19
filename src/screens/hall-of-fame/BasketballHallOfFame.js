import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import format from "date-fns/format";
import isSameDay from "date-fns/isSameDay";

import * as S from "./HallOfFame.styles";
import * as G from "../../styles/shared";

import { BASE_ROUTES } from "../../Routes";
import { Button } from "../../components/button/Button";

export const BasketballHallOfFame = () => {
  useEffect(() => {
    // send to local state to display
    const display = (trifectaStandings, lastScraped) => {
      //   setTrifectaStandings(trifectaStandings);
      //   setUpdatedAsOf(lastScraped);
    };

    ///////////// only 1 function gets run inside useEffect /////////////
    display();
  }, []);

  return (
    <S.FlexColumnCenterContainer>
      <S.Title>Basketball Hall of Fame</S.Title>
    </S.FlexColumnCenterContainer>
  );
};
