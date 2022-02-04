import React from "react";
import { Link } from "react-router-dom";
import { BASE_ROUTES } from "../Routes";

export const Navbar = () => {
  return (
    <div>
      <ul>
        <Link to={BASE_ROUTES.Home}>Home link</Link>
        <Link to={BASE_ROUTES.TradeHistory}>Trade history link</Link>
      </ul>
    </div>
  );
};
