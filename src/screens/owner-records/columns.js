import { capitalize } from "lodash";
import * as S from "styles/OwnerRecords.styles";

export const TrifectaHistoryColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
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

export const AllTimeRecordsColumns = [
  {
    Header: "Sport",
    accessor: (data) => capitalize(data.sport),
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
    Header: "Average Roto Points / Points For",
    accessor: "avgPoints",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
];

export const AllTimeBColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
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
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
    sortDescFirst: true,
  },
  {
    Header: "Roto Points",
    accessor: "rotoPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const AllTimeFootballColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
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
    Header: "Win %",
    accessor: (data) => Number(data.winPer).toFixed(3),
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
];
