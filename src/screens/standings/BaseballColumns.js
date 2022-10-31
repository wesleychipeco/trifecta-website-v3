import * as S from "styles/Standings.styles";

export const TrifectaColumns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    disableSortBy: true,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "H2H Trifecta Points",
    accessor: "h2hTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Roto Trifecta Points",
    accessor: "rotoTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Total Trifecta Points",
    accessor: "totalTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const H2HColumns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Wins",
    accessor: "wins",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Losses",
    accessor: "losses",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Ties",
    accessor: "ties",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Win%",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "H2H Trifecta Points",
    accessor: "h2hTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const RotoColumns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "R",
    accessor: "RPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "HR",
    accessor: "HRPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "RBI",
    accessor: "RBIPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "K",
    accessor: "KPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SB",
    accessor: "SBPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "OBP",
    accessor: "OBPPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: false,
  },
  {
    Header: "SO",
    accessor: "SOPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "QS",
    accessor: "QSPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "W",
    accessor: "WPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "SV",
    accessor: "SVPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "ERA",
    accessor: "ERAPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "WHIP",
    accessor: "WHIPPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Roto Points",
    accessor: "totalPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Roto Trifecta Points",
    accessor: "rotoTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const RotoStatsColumns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "R",
    accessor: "R",
    sortDescFirst: true,
  },
  {
    Header: "HR",
    accessor: "HR",
    sortDescFirst: true,
  },
  {
    Header: "RBI",
    accessor: "RBI",
    sortDescFirst: true,
  },
  {
    Header: "K",
    accessor: "K",
    sortDescFirst: true,
  },
  {
    Header: "SB",
    accessor: "SB",
    sortDescFirst: false,
  },
  {
    Header: "OBP",
    accessor: (data) => Number(data.OBP).toFixed(4),
    sortDescFirst: true,
  },
  {
    Header: "SO",
    accessor: "SO",
    sortDescFirst: true,
  },
  {
    Header: "QS",
    accessor: "QS",
    sortDescFirst: true,
  },
  {
    Header: "W",
    accessor: "W",
    sortDescFirst: true,
  },
  {
    Header: "SV",
    accessor: "SV",
    sortDescFirst: true,
  },
  {
    Header: "ERA",
    accessor: (data) => Number(data.ERA).toFixed(3),
    sortDescFirst: false,
  },
  {
    Header: "WIHP",
    accessor: (data) => Number(data.WHIP).toFixed(3),
    sortDescFirst: true,
  },
];
