import * as S from "styles/StandardScreen.styles";
import * as T from "styles/OwnerScreen.styles";

export const TotalMatchupsColumns = [
  {
    Header: "Owner Name(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Basketball Win%",
    accessor: (data) => Number(data.basketballWinPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Baseball Win%",
    accessor: (data) => Number(data.baseballWinPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Football Win%",
    accessor: (data) => Number(data.footballWinPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Total Win%",
    accessor: (data) => Number(data.totalWinPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
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
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Losses",
    accessor: "losses",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Ties",
    accessor: "ties",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
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
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Losses",
    accessor: "losses",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Ties",
    accessor: "ties",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points For",
    accessor: "pointsFor",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Points Against",
    accessor: "pointsAgainst",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Point Differential",
    accessor: "pointsDiff",
    tableHeaderCell: T.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];
