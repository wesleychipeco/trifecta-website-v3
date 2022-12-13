import * as S from "styles/StandardScreen.styles";

export const DynastyStandingsColumns = [
  {
    Header: "Team Name",
    accessor: "teamName",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "GM(s)",
    accessor: "gm",
    tableHeaderCell: S.StringTableHeaderCell,
    disableSortBy: true,
  },
  {
    Header: "Division",
    accessor: "division",
    disableSortBy: true,
  },
  {
    Header: "Win%",
    accessor: (data) => Number(data.winPer).toFixed(3),
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Dynasty Points",
    accessor: "dynastyPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const BasketballBaseballColumns = [
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
    Header: "Games Back",
    accessor: "gamesBack",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: false,
  },
  {
    Header: "Division Record",
    accessor: "divisionRecord",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true, // TODO sortBy function that actually sorts Division Record accurately
  },
];

export const FootballColumns = [
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
    Header: "Games Back",
    accessor: "gamesBack",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: false,
  },
  {
    Header: "Division Record",
    accessor: "divisionRecord",
    tableHeaderCell: S.NumbersTableHeaderCell,
    disableSortBy: true, // TODO sortBy function that actually sorts Division Record accurately
  },
];
