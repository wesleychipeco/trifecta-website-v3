import "./resources/icons/icons";

import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";

import * as T from "styles/shared";
import * as S from "App.styles";
import { ROUTES, STATIC_ROUTES } from "Routes";
import GlobalStyle from "styles/global";
import { OpenNavbar } from "components/navbar/OpenNavbar";
import { ClosedNavbar } from "components/navbar/ClosedNavbar";
import { HallOfFame } from "screens/trifecta/hall-of-fame/HallOfFame";
import { HomeScreen } from "screens/home-screen/HomeScreen";
import { TrifectaTradeHistory } from "screens/trifecta/trade-history/TradeHistory";
import "components/navbar/transition.styles.css";
import { BasketballStandings } from "screens/trifecta/standings/BasketballStandings";
import { BaseballStandings } from "screens/trifecta/standings/BaseballStandings";
import { FootballStandings } from "screens/trifecta/standings/FootballStandings";
import { TrifectaStandings } from "screens/trifecta/standings/TrifectaStandings";
import { useEffect } from "react";
import { returnMongoCollection } from "database-management";
import { setSeasonVariables } from "store/currentVariablesSlice";
import { setOwnerNames } from "store/namesSlice";
import { BasketballHallOfFame } from "screens/trifecta/hall-of-fame/BasketballHallOfFame";
import { BaseballHallOfFame } from "screens/trifecta/hall-of-fame/BaseballHallOfFame";
import { FootballHallOfFame } from "screens/trifecta/hall-of-fame/FootballHallOfFame";
import { OwnerMatchups } from "screens/trifecta/owner-matchups/OwnerMatchups";
import { OwnerRecords } from "screens/trifecta/owner-records/OwnerRecords";
import { CompileMatchups } from "screens/trifecta/compile-matchups/CompileMatchups";
import { CompileTotalMatchups } from "screens/compile-matchups/CompileTotalMatchups";
import { DynastyHome } from "screens/dynasty/DynastyHome";
import { GLOBAL_VARIABLES } from "Constants";
import { DynastySportStandings } from "screens/dynasty/DynastySportStandings";
import { DynastyTradeHistory } from "screens/dynasty/DynastyTradeHistory";
import { EraBannerHOC } from "screens/dynasty/BannerHOC";
import { DynastyStandings } from "screens/dynasty/DynastyStandings";
import { TradeAssetDashboard } from "screens/dynasty/TradeAssetDashboard";
import { TradeAssetHome } from "screens/dynasty/TradeAssetHome";
import { SignInBanner } from "components/banner/SignInBanner";
import { DraftResults } from "screens/dynasty/DraftResults";
import { DraftsHome } from "screens/dynasty/DraftsHome";
import { CommissionerHome } from "screens/dynasty/CommissionerHome";
import { CommissionerEnterTrade } from "screens/dynasty/CommissionerEnterTrade";

export const App = () => {
  const dispatch = useDispatch();
  const isNavbarOpen = useSelector((state) => state.navbar.isNavbarOpen);
  const isReady = useSelector((state) => state.currentVariables.isReady);
  const ownerNames = useSelector((state) => state.names.ownerNames);

  useEffect(() => {
    if (!isReady) {
      const loadSeasonVariables = async () => {
        const collection = await returnMongoCollection(GLOBAL_VARIABLES);
        const data = await collection.find({});
        const object = data[0];
        const { trifecta: trifectaObject, dynasty: dynastyObject } = object;
        const { basketball, baseball, football } = trifectaObject;
        const trifectaVariables = {
          currentYear: trifectaObject.currentYear,
          isBasketballStarted: basketball.seasonStarted,
          isBasketballInSeason: basketball.inSeason,
          isBaseballStarted: baseball.seasonStarted,
          isBaseballInSeason: baseball.inSeason,
          isFootballStarted: football.seasonStarted,
          isFootballInSeason: football.inSeason,
          basketballAhead: trifectaObject.basketballAhead,
        };
        const seasonVariables = {
          trifecta: trifectaVariables,
          dynasty: dynastyObject,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <SignInBanner />
        <S.Body>
          <Routes>
            <Route path={STATIC_ROUTES.Home} element={<HomeScreen />} exact />
            {/* ///////////// Trifecta Break ///////////////*/}
            <Route path={STATIC_ROUTES.TrifectaHome}>
              <Route path="" element={<HomeScreen />} exact />
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
                element={<TrifectaTradeHistory />}
                exact
              />
              <Route
                path={STATIC_ROUTES.HallOfFame}
                element={<HallOfFame />}
                exact
              />
              <Route
                path={STATIC_ROUTES.BasketballHallOfFame}
                element={<BasketballHallOfFame />}
                exact
              />
              <Route
                path={STATIC_ROUTES.BaseballHallOfFame}
                element={<BaseballHallOfFame />}
                exact
              />
              <Route
                path={STATIC_ROUTES.FootballHallOfFame}
                element={<FootballHallOfFame />}
                exact
              />
              <Route
                path={ROUTES.OwnerMatchups}
                element={<OwnerMatchups />}
                exact
              />
              <Route
                path={ROUTES.OwnerRecords}
                element={<OwnerRecords />}
                exact
              />
              <Route
                path={STATIC_ROUTES.CompileMatchups}
                element={<CompileMatchups />}
                exact
              />
              <Route
                path={STATIC_ROUTES.CompileTotalMatchups}
                element={<CompileTotalMatchups />}
                exact
              />
            </Route>
            {/* ///////////// Dynasty Break ///////////////*/}
            <Route path={STATIC_ROUTES.DynastyHome}>
              <Route path={STATIC_ROUTES.DynastyEra} element={<EraBannerHOC />}>
                <Route path="" element={<DynastyHome />} exact />
                <Route
                  path={STATIC_ROUTES.DynastyStandings}
                  element={<DynastyStandings />}
                  exact
                />
                <Route
                  path={ROUTES.BasketballStandings}
                  element={<DynastySportStandings sport="basketball" />}
                  exact
                />
                <Route
                  path={ROUTES.BaseballStandings}
                  element={<DynastySportStandings sport="baseball" />}
                  exact
                />
                <Route
                  path={ROUTES.FootballStandings}
                  element={<DynastySportStandings sport="football" />}
                  exact
                />
                <Route
                  path={ROUTES.TradeHistory}
                  element={<DynastyTradeHistory />}
                  exact
                />
                <Route
                  path={STATIC_ROUTES.TradeAssetHome}
                  element={<TradeAssetHome />}
                  exact
                />
                <Route
                  path={ROUTES.TradeAssetDashboard}
                  element={<TradeAssetDashboard />}
                  exact
                />
                <Route
                  path={ROUTES.DraftsHome}
                  element={<DraftsHome />}
                  exact
                />
                <Route
                  path={ROUTES.DraftResults}
                  element={<DraftResults />}
                  exact
                />
                <Route
                  path={ROUTES.CommissionerHome}
                  element={<CommissionerHome />}
                  exact
                />
                <Route
                  path={ROUTES.CommissionerEnterTrade}
                  element={<CommissionerEnterTrade />}
                  exact
                />
              </Route>
            </Route>
          </Routes>
        </S.Body>
      </T.FlexRow>
    </S.App>
  );
};
