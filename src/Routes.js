export const STATIC_ROUTES = {
  Home: "/",
  TradeHistory: "/trade-history",
  HallOfFame: "/halloffame",
  BasketballHallOfFame: "/halloffame/basketball",
  BaseballHallOfFame: "/halloffame/baseball",
  FootballHallOfFame: "/halloffame/football",
  GenericOwnerMatchups: "/matchups",
  GenericOwnerRecords: "/ownerrecords",
  CompileMatchups: "/compilematchups",
};

export const ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "/standings/basketball/:year",
  BaseballStandings: "/standings/baseball/:year",
  FootballStandings: "/standings/football/:year",
  TrifectaStandings: "/standings/trifecta/:year",
  OwnerRecords: "/ownerrecords/:teamNumber",
  OwnerMatchups: "/ownermatchups/:teamNumber/:year",
};

export const BASE_ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "/standings/basketball",
  BaseballStandings: "/standings/baseball",
  FootballStandings: "/standings/football",
  TrifectaStandings: "/standings/trifecta",
  OwnerRecords: "/ownerrecords",
  OwnerMatchups: "/ownermatchups",
};
