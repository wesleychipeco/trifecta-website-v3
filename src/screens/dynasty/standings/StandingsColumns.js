import * as S from "styles/StandardScreen.styles";

export const DynastyStandingsColumnsRaw = [
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
    accessor: "totalDynastyPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const PlayoffColumns = [
  {
    Header: "Regular Season Dynasty Points",
    accessor: "dynastyPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
  {
    Header: "Playoff Points",
    accessor: "playoffPoints",
    tableHeaderCell: S.NumbersTableHeaderCell,
    sortDescFirst: true,
  },
];

export const Dynasty3x5GmColumn = {
  Header: "GM(s)",
  accessor: "gm",
  tableHeaderCell: S.StringTableHeaderCell,
  disableSortBy: true,
};

export const Dynasty3x5DynastyPointsColumn = {
  Header: "Total Dynasty Points",
  accessor: "totalDynastyPoints",
  tableHeaderCell: S.NumberCenteredTableHeaderCell,
  sortDescFirst: true,
};

export const Dynasty3x5DynastyPointsInProgressColumn = {
  Header: "Total **In-Progress** Dynasty Points",
  accessor: "totalDynastyPointsInSeason",
  tableHeaderCell: S.NumberCenteredTableHeaderCell,
  sortDescFirst: true,
};

export const FootballPointsColumns = [
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
