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
