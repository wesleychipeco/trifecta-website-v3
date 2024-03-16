import * as S from "styles/StandardScreen.styles";

export const BasketballStatsColumns = [
  {
    Header: "Player",
    accessor: "name",
    tableHeaderCell: S.StringTableHeaderCell,
  },
  {
    Header: "Position",
    accessor: "position",
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
    Header: "GM",
    accessor: "gmName",
    tableHeaderCell: S.NumbersTableHeaderCell,
  },
  {
    Header: "Age",
    accessor: "age",
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
    Header: "Position",
    accessor: "position",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true,
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
    Header: "GM",
    accessor: "gmName",
    tableHeaderCell: S.NumbersTableHeaderCell,
  },
  {
    Header: "Age",
    accessor: "age",
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
