import * as S from "styles/OwnerMatchups.styles";

export const TotalMatchupsColumns = [
  {
    Header: "Owner Name(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Basketball Win%",
    accessor: (data) => Number(data.basketballWinPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Baseball Win%",
    accessor: (data) => Number(data.baseballWinPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Football Win%",
    accessor: (data) => Number(data.footballWinPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Total Win%",
    accessor: (data) => Number(data.totalWinPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const BMatchupsColumns = [
  {
    Header: "Owner Name(s)",
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
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const FootballMatchupsColumns = [
  {
    Header: "Owner Name(s)",
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
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points For",
    accessor: "pointsFor",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points Against",
    accessor: "pointsAgainst",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Point Differential",
    accessor: "pointsDiff",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];
