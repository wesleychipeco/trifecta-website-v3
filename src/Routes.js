export const STATIC_ROUTES = {
  Home: "/",
  TradeHistory: "/trade-history",
};

export const ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "/standings/basketball/:year",
  BaseballStandings: "/standings/baseball/:year",
  FootballStandings: "/standings/football/:year",
  TrifectaStandings: "/standings/trifecta/:year",
};

export const BASE_ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "/standings/basketball",
  BaseballStandings: "/standings/baseball",
  FootballStandings: "/standings/football",
  TrifectaStandings: "/standings/trifecta",
};
