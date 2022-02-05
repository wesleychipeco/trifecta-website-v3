import "./resources/icons/icons";

import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";

import * as T from "./styles/shared";
import * as S from "./App.styles";
import { BASE_ROUTES } from "./Routes";
import GlobalStyle from "./styles/global";
import { OpenNavbar } from "./components/navbar/OpenNavbar";
import { ClosedNavbar } from "./components/navbar/ClosedNavbar";
import { HomeScreen } from "./screens/home-screen/HomeScreen";
import { TradeHistory } from "./screens/trade-history/TradeHistory";
import "./components/navbar/transition.styles.css";

export const App = () => {
  const isNavbarOpen = useSelector((state) => state.navbar.isNavbarOpen);

  return (
    <>
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
            <Route path={BASE_ROUTES.Home} element={<HomeScreen />} exact />
            <Route
              path={BASE_ROUTES.TradeHistory}
              element={<TradeHistory />}
              exact
            />
          </Routes>
        </S.Body>
      </T.FlexRow>
    </>
  );
};
