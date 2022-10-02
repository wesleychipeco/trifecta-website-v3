import * as S from "./FootballStandings.styles";

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
    Header: "T5-B5 Trifecta Points",
    accessor: "top5Bottom5TrifectaPoints",
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
    Header: "Points For",
    accessor: (data) => Number(data.pointsFor).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points Against",
    accessor: (data) => Number(data.pointsAgainst).toFixed(1),
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

export const Top5Bottom5Columns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Wins",
    accessor: "wins",
    sortDescFirst: true,
  },
  {
    Header: "Losses",
    accessor: "losses",
    sortDescFirst: true,
  },
  {
    Header: "Win%",
    accessor: (data) => Number(data.winPer).toFixed(3),
    sortDescFirst: true,
  },
  {
    Header: "T5-B5 Trifecta Points",
    accessor: "top5Bottom5TrifectaPoints",
    sortDescFirst: true,
  },
];

export const FootballColumns = [
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
    Header: "Points For",
    accessor: (data) => Number(data.pointsFor).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points Against",
    accessor: (data) => Number(data.pointsAgainst).toFixed(1),
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
