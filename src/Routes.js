export const STATIC_ROUTES = {
  Home: "/",
  TrifectaHome: "/trifecta",
  DynastyHome: "/dynasty",
  DynastyEra: ":era",
  TradeHistory: "trade-history",
  TransactionsHistoryHome: "transactions-history",
  HallOfFame: "hall-of-fame",
  BasketballHallOfFame: "hall-of-fame/basketball",
  BaseballHallOfFame: "hall-of-fame/baseball",
  FootballHallOfFame: "hall-of-fame/football",
  GenericOwnerMatchups: "matchups",
  GenericOwnerRecords: "owner-records",
  CompileMatchups: "compile-matchups",
  CompileTotalMatchups: "compile-total-matchups",
  DynastyStandings: "standings/dynasty",
  TradeAssetHome: "trade-asset-home",
  DraftsHome: "drafts-home",
  CommissionerHome: "commissioner-home",
  CommissionerEnterTrade: "commissioner-enter-trade",
  CommissionerAssignStartupDraftSlots:
    "commissioner-assign-startup-draft-slots",
  CommissionerAssignSupplementalDraftSlots:
    "commissioner-assign-supplemental-draft-slots",
  CommissionerStartNewSport: "commissioner-start-new-sport",
  CommissionerCompleteSport: "commissioner-complete-sport",
  CommissionerInitializeSupplementalDraftPicks:
    "commissioner-initialize-supplemental-draft-picks",
  CommissionerTradeFutureDraftPicks: "commissioner-trade-future-draft-picks",
  CommissionerRemoveCompletedDraftPicks:
    "commissioner-remove-completed-draft-picks",
};

export const ROUTES = {
  ...STATIC_ROUTES,
  BasketballStandings: "standings/basketball/:year",
  BaseballStandings: "standings/baseball/:year",
  FootballStandings: "standings/football/:year",
  TrifectaStandings: "standings/trifecta/:year",
  OwnerRecords: "owner-records/:teamNumber",
  OwnerMatchups: "owner-matchups/:teamNumber/:year",
  TradeAssetDashboard: "trade-asset-dashboard/:gmAbbreviation",
  DraftBoard: "draft/:sport/:year",
  TransactionsHistory: "transactions-history/:sport/:year",
  PlayerStats: "player-stats/:sport",
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
