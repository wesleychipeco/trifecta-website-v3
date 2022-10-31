import * as S from "styles/SportHallOfFame.styles";

export const PastChampionsColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Team Name",
    accessor: "teamName",
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
    accessor: "winPer",
    sortDescFirst: true,
  },
  {
    Header: "Roto Points",
    accessor: "rotoPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const AllTimeRecordsColumns = [
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "# of Seasons",
    accessor: "seasons",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
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
    Header: "Average Roto Points",
    accessor: "rotoPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const BestH2HColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
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
];

export const BestRotoColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Roto Points",
    accessor: "rotoPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const FootballPastChampionsColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Team Name",
    accessor: "teamName",
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
    Header: "Point Differential",
    accessor: (data) => Number(data.pointsDiff).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const FootballAllTimeRecordsColumns = [
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "# of Seasons",
    accessor: "seasons",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
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
    Header: "Average Point Differential",
    accessor: (data) => Number(data.pointsDiff).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const Football10WinH2HColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
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
    Header: "Point Differential",
    accessor: (data) => Number(data.pointsDiff).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const FootballHighestSingleWeekColumns = [
  {
    Header: "Year",
    accessor: "year",
    sortDescFirst: false,
  },
  {
    Header: "Week",
    accessor: "week",
    disableSortBy: true,
  },
  {
    Header: "Owner(s)",
    accessor: "ownerNames",
    disableSortBy: true,
  },
  {
    Header: "Team Name",
    accessor: "teamName",
    disableSortBy: true,
  },
  {
    Header: "Points Scored",
    accessor: (data) => Number(data.pointsFor).toFixed(1),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];
