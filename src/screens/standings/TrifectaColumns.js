import * as S from "styles/Standings.styles";

export const TrifectaColumnsPre2019 = [
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Football Trifecta Points",
    accessor: "footballTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Basketball Trifecta Points",
    accessor: "basketballTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Baseball Trifecta Points",
    accessor: "baseballTrifectaPoints",
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

export const TrifectaColumnsPost2019 = [
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Basketball Trifecta Points",
    accessor: "basketballTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Baseball Trifecta Points",
    accessor: "baseballTrifectaPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Football Trifecta Points",
    accessor: "footballTrifectaPoints",
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
