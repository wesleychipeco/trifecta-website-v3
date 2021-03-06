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
import { setSeasonVariables } from "./store/currentVariablesSlice";
import { setOwnerNames } from "./store/namesSlice";

export const App = () => {
  const dispatch = useDispatch();
  const isNavbarOpen = useSelector((state) => state.navbar.isNavbarOpen);
  const isReady = useSelector((state) => state.currentVariables.isReady);
  const ownerNames = useSelector((state) => state.names.ownerNames);

  useEffect(() => {
    if (!isReady) {
      const loadSeasonVariables = async () => {
        const collection = await returnMongoCollection("seasonVariables");
        const data = await collection.find({});
        const object = data[0];
        const { basketball, baseball, football } = object;
        const seasonVariables = {
          currentYear: object.currentYear,
          isBasketballStarted: basketball.seasonStarted,
          isBasketballInSeason: basketball.inSeason,
          isBaseballStarted: baseball.seasonStarted,
          isBaseballInSeason: baseball.inSeason,
          isFootballStarted: football.seasonStarted,
          isFootballInSeason: football.inSeason,
        };
        dispatch(setSeasonVariables(seasonVariables));
      };

      loadSeasonVariables();
    }

    if (Object.keys(ownerNames).length === 0) {
      const loadOwnerNames = async () => {
        const collection = await returnMongoCollection("ownerIds");
        const data = await collection.find({});

        const holder = {};
        data.forEach((owner) => {
          const ownerId = owner.ownerId;
          holder[ownerId] = owner.ownerName;
        });
        dispatch(setOwnerNames(holder));
      };

      loadOwnerNames();
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
