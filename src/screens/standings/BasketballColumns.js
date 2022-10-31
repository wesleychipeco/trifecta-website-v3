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
    Header: "FG%",
    accessor: "FGPERPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "FT%",
    accessor: "FTPERPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "3PM",
    accessor: "THREEPMPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "REB",
    accessor: "REBPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "AST",
    accessor: "ASTPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "STL",
    accessor: "STLPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "TO",
    accessor: "TOPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: false,
  },
  {
    Header: "PTS",
    accessor: "PTSPoints",
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
    Header: "FG%",
    accessor: (data) => Number(data.FGPER).toFixed(3),
    sortDescFirst: true,
  },
  {
    Header: "FT%",
    accessor: (data) => Number(data.FTPER).toFixed(3),
    sortDescFirst: true,
  },
  {
    Header: "3PM",
    accessor: "THREEPM",
    sortDescFirst: true,
  },
  {
    Header: "REB",
    accessor: "REB",
    sortDescFirst: true,
  },
  {
    Header: "AST",
    accessor: "AST",
    sortDescFirst: true,
  },
  {
    Header: "STL",
    accessor: "STL",
    sortDescFirst: true,
  },
  {
    Header: "TO",
    accessor: "TO",
    sortDescFirst: false,
  },
  {
    Header: "PTS",
    accessor: "PTS",
    sortDescFirst: true,
  },
];

export const BasketballColumns = [
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
    Header: "Trifecta Points",
    accessor: "trifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Playoff Points",
    accessor: "playoffPoints",
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
