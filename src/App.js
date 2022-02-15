import "./resources/icons/icons";

import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";

import * as T from "./styles/shared";
import * as S from "./App.styles";
import { ROUTES, STATIC_ROUTES } from "./Routes";
import GlobalStyle from "./styles/global";
import { OpenNavbar } from "./components/navbar/OpenNavbar";
import { ClosedNavbar } from "./components/navbar/ClosedNavbar";
import { HomeScreen } from "./screens/home-screen/HomeScreen";
import { TradeHistory } from "./screens/trade-history/TradeHistory";
import "./components/navbar/transition.styles.css";
import { BasketballStandings } from "./screens/basketball-standings/BasketballStandings";
import { BaseballStandings } from "./screens/baseball-standings/BaseballStandings";
import { FootballStandings } from "./screens/football-standings/FootballStandings";
import { TrifectaStandings } from "./screens/trifecta-standings/TrifectaStandings";
import { useEffect } from "react";
import { returnMongoCollection } from "./database-management";
import { setSeasonVariables } from "./store/navbarSlice";

export const App = () => {
  const dispatch = useDispatch();
  const isNavbarOpen = useSelector((state) => state.navbar.isNavbarOpen);
  const seasonVariables = useSelector((state) => state.navbar.seasonVariables);
  const { currentYear } = seasonVariables;

  useEffect(() => {
    if (currentYear === "") {
      const loadSeasonVariables = async () => {
        const collection = await returnMongoCollection("seasonVariables");
        const data = await collection.find({});
        const object = data[0];
        const seasonVariables = {
          currentYear: object.currentYear,
          isBasketballStarted: object.basketball.seasonStarted,
          isBaseballStarted: object.baseball.seasonStarted,
          isFootballStarted: object.football.seasonStarted,
        };
        dispatch(setSeasonVariables(seasonVariables));
      };

      loadSeasonVariables();
    }
  }, []);

  return (
    <S.App>
      <GlobalStyle />
      <T.FlexRow>
        {!isNavbarOpen && <ClosedNavbar />}
        <CSSTransition
          in={isNavbarOpen}
          timeout={600}
          classNames="navbar"
          unmountOnExit
        >
          <OpenNavbar />
        </CSSTransition>
        <S.Body>
          <Routes>
            <Route path={STATIC_ROUTES.Home} element={<HomeScreen />} exact />
            <Route
              path={ROUTES.BasketballStandings}
              element={<BasketballStandings />}
              exact
            />
            <Route
              path={ROUTES.BaseballStandings}
              element={<BaseballStandings />}
              exact
            />
            <Route
              path={ROUTES.FootballStandings}
              element={<FootballStandings />}
              exact
            />
            <Route
              path={ROUTES.TrifectaStandings}
              element={<TrifectaStandings />}
              exact
            />
            <Route
              path={STATIC_ROUTES.TradeHistory}
              element={<TradeHistory />}
              exact
            />
          </Routes>
        </S.Body>
      </T.FlexRow>
    </S.App>
  );
};
