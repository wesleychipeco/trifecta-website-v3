export const STATIC_ROUTES = {
  Home: "/",
  TrifectaHome: "/trifecta",
  DynastyHome: "/dynasty",
  DynastyEra: ":era",
  TradeHistory: "trade-history",
  HallOfFame: "hall-of-fame",
  BasketballHallOfFame: "hall-of-fame/basketball",
  BaseballHallOfFame: "hall-of-fame/baseball",
  FootballHallOfFame: "hall-of-fame/football",
  GenericOwnerMatchups: "matchups",
  GenericOwnerRecords: "owner-records",
  CompileMatchups: "compile-matchups",
  DynastyStandings: "standings/dynasty",
};

export const ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "standings/basketball/:year",
  BaseballStandings: "standings/baseball/:year",
  FootballStandings: "standings/football/:year",
  TrifectaStandings: "standings/trifecta/:year",
  OwnerRecords: "owner-records/:teamNumber",
  OwnerMatchups: "owner-matchups/:teamNumber/:year",
};

export const BASE_ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "standings/basketball",
  BaseballStandings: "standings/baseball",
  FootballStandings: "standings/football",
  TrifectaStandings: "standings/trifecta",
  OwnerRecords: "owner-records",
  OwnerMatchups: "owner-matchups",
};
