import { Routes, Route } from "react-router-dom";
import React from "react";
import { BASE_ROUTES } from "./Routes";
import { Navbar } from "./components/Navbar";
import { HomeScreen } from "./screens/home-screen/HomeScreen";
import { TradeHistory } from "./screens/trade-history/TradeHistory";

export const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path={BASE_ROUTES.Home} element={<HomeScreen />} exact />
        <Route
          path={BASE_ROUTES.TradeHistory}
          element={<TradeHistory />}
          exact
        />
      </Routes>
    </>
  );
};
