import { Routes, Route } from "react-router-dom";

import * as T from "./styles/shared";
import * as S from "./App.styles";
import { BASE_ROUTES } from "./Routes";
import GlobalStyle from "./styles/global";
import { Navbar } from "./components/navbar/Navbar";
import { HomeScreen } from "./screens/home-screen/HomeScreen";
import { TradeHistory } from "./screens/trade-history/TradeHistory";

export const App = () => {
  return (
    <>
      <GlobalStyle />
      <T.FlexRow>
        <Navbar />
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
