import * as S from "styles/StandardScreen.styles";

export const BasketballStatsColumns = [
  {
    Header: "Player",
    accessor: "name",
    tableHeaderCell: S.StringTableHeaderCell,
  },
  {
    Header: "GM",
    accessor: "gmName",
    tableHeaderCell: S.NumbersTableHeaderCell,
  },
  {
    Header: "Year",
    accessor: "year",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Age",
    accessor: "age",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Position",
    accessor: "position",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "isTotalRecord",
    accessor: "isTotalRecord",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Games Played",
    accessor: "gamesPlayed",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "PTS",
    accessor: "points",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "REB",
    accessor: "rebounds",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "AST",
    accessor: "assists",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "FG%",
    accessor: "fgPer",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "FT%",
    accessor: "ftPer",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "3PM",
    accessor: "threepm",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "STL",
    accessor: "steals",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "BLK",
    accessor: "blocks",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "TO",
    accessor: "turnovers",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const BaseballStatsColumns = [
  {
    Header: "Player",
    accessor: "name",
    tableHeaderCell: S.StringTableHeaderCell,
  },
  {
    Header: "GM",
    accessor: "gmName",
    tableHeaderCell: S.NumbersTableHeaderCell,
  },
  {
    Header: "Type",
    accessor: "type",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Year",
    accessor: "year",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Age",
    accessor: "age",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Position",
    accessor: "position",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "isTotalRecord",
    accessor: "isTotalRecord",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Games Played",
    accessor: "gamesPlayed",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "R",
    accessor: "runs",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "HR",
    accessor: "homeRuns",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "RBI",
    accessor: "rbi",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SO",
    accessor: "strikeouts",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SB",
    accessor: "stolenBases",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "OBP",
    accessor: "obp",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "IP",
    accessor: "ip",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "QS",
    accessor: "qualityStarts",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "W",
    accessor: "wins",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "K",
    accessor: "ks",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SVH",
    accessor: "savesHolds",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "ERA",
    accessor: "era",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "WHIP",
    accessor: "whip",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const FootballStatsColumns = [
  {
    Header: "Player",
    accessor: "name",
    tableHeaderCell: S.StringTableHeaderCell,
  },
  {
    Header: "GM",
    accessor: "gmName",
    tableHeaderCell: S.StringTableHeaderCell,
  },
  {
    Header: "Year",
    accessor: "year",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Age",
    accessor: "age",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Position",
    accessor: "position",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "isTotalRecord",
    accessor: "isTotalRecord",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Fantasy Points",
    accessor: "fantasyPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Games Played",
    accessor: "gamesPlayed",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Pass YD",
    accessor: "passingYards",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Pass TD",
    accessor: "passingTDs",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Pass 1D",
    accessor: "passing1D",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "INT",
    accessor: "interceptions",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SK",
    accessor: "sacks",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "FL",
    accessor: "fumblesLost",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rush YD",
    accessor: "rushingYards",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rush TD",
    accessor: "rushingTDs",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rush 1D",
    accessor: "rushing1D",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "REC",
    accessor: "receptions",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rec YD",
    accessor: "receivingYards",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rec TD",
    accessor: "receivingTDs",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Rec 1D",
    accessor: "receiving1D",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "TOT 2PA",
    accessor: "total2PA",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "MISC TDs",
    accessor: "miscTDs",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const BASKETBALL_POSITIONS_OPTIONS = [
  {
    value: "",
    label: "All",
  },
  {
    value: "PG",
    label: "PG",
  },
  {
    value: "SG",
    label: "SG",
  },
  {
    value: "SF",
    label: "SF",
  },
  {
    value: "PF",
    label: "PF",
  },
  {
    value: "C",
    label: "C",
  },
];

export const BASEBALL_POSITIONS_OPTIONS = [
  {
    value: "",
    label: "All",
  },
  {
    value: "C",
    label: "C",
  },
  {
    value: "1B",
    label: "1B",
  },
  {
    value: "2B",
    label: "2B",
  },
  {
    value: "3B",
    label: "3B",
  },
  {
    value: "SS",
    label: "SS",
  },
  {
    value: "OF",
    label: "OF",
  },
  {
    value: "UT",
    label: "UT",
  },
  {
    value: "SP",
    label: "SP",
  },
  {
    value: "RP",
    label: "RP",
  },
];

export const FOOTBALL_POSITIONS_OPTIONS = [
  {
    value: "",
    label: "All",
  },
  {
    value: "QB",
    label: "QB",
  },
  {
    value: "RB",
    label: "RB",
  },
  {
    value: "WR",
    label: "WR",
  },
  {
    value: "TE",
    label: "TE",
  },
];
