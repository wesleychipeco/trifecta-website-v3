import React, { useCallback, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import Select from "react-select";

import * as S from "styles/PlayerStats.styles";
import * as T from "styles/Table.styles";
import * as G from "styles/shared";
import * as X from "styles/TransactionsHistory.styles";
import { extractBetweenParentheses } from "utils/strings";
import Toggle from "react-toggle";

const PLAYER_INPUT = "player";
const GM_INPUT = "gm";
const POSITION_INPUT = "position";
const YEAR_INPUT = "year";
const BASEBALL_TYPE_INPUT = "type";

const EXCLUDED_PER_GAME_HEADERS = [
  "Player",
  "Position",
  "Year",
  "GM",
  "Age",
  "Games Played",
  "FG%",
  "FT%",
];

const BASKETBALL_POSITIONS = [
  {
    value: "",
    label: "All",
  },
  {
    value: "PG",
    label: "PG",
  },
  {
    value: "SG",
    label: "SG",
  },
  {
    value: "SF",
    label: "SF",
  },
  {
    value: "PF",
    label: "PF",
  },
  {
    value: "C",
    label: "C",
  },
];

const BASEBALL_POSITIONS = [
  {
    value: "",
    label: "All",
  },
  {
    value: "C",
    label: "C",
  },
  {
    value: "1B",
    label: "1B",
  },
  {
    value: "2B",
    label: "2B",
  },
  {
    value: "3B",
    label: "3B",
  },
  {
    value: "SS",
    label: "SS",
  },
  {
    value: "OF",
    label: "OF",
  },
  {
    value: "UT",
    label: "UT",
  },
  {
    value: "SP",
    label: "SP",
  },
  {
    value: "RP",
    label: "RP",
  },
];

export const PlayerStatsTable = ({
  sport,
  columns,
  data,
  table = null,
  tableHead = null,
  tableBody = null,
  tableHeadRow = null,
  tableBodyRow = null,
  tableBodyCell = null,
  sortBy = [],
  gmsArray = [],
  isMobile = false,
}) => {
  const gmOptions = useMemo(() => {
    const onlyGmsArray = gmsArray.map((gm) => ({
      value: extractBetweenParentheses(gm),
      label: gm,
    }));
    onlyGmsArray.unshift({ value: "", label: "All GMs" });
    return onlyGmsArray;
  }, [gmsArray]);

  const positionsOptions = useMemo(() => {
    switch (sport) {
      case "basketball":
        return BASKETBALL_POSITIONS;
      case "baseball":
        return BASEBALL_POSITIONS;
      case "football":
      default:
        return BASKETBALL_POSITIONS;
    }
  }, [sport]);

  const [playerQuery, setPlayerQuery] = useState("");
  const [gmQuery, setGmQuery] = useState("");
  const [positionQuery, setPositionQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");
  const [perGameQuery, setPerGameQuery] = useState("");
  const [baseballTypeQuery, setBaseballTypeQuery] = useState("");

  const globalFilterFunction = useCallback(
    (rows, _id, _query) => {
      return rows.filter((row) => {
        const name = row.values?.name ?? "";
        const gmName = row.values?.gmName ?? "";
        const position = row.values?.position ?? "";
        const year = row.values?.year ?? "";
        const type = row.values?.type ?? "";
        return (
          name.toLowerCase().includes(playerQuery) &&
          gmName.toLowerCase().includes(gmQuery) &&
          position.toLowerCase().includes(positionQuery) &&
          year.toLowerCase().includes(yearQuery) &&
          type.toLowerCase().includes(baseballTypeQuery)
        );
      });
    },
    [playerQuery, gmQuery, positionQuery, yearQuery, baseballTypeQuery]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy,
        hiddenColumns: ["type"],
      },
      globalFilter: globalFilterFunction,
    },
    useGlobalFilter,
    useSortBy
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setGlobalFilter,
  } = tableInstance;

  const handleFilterInputChange = (e) => {
    const { value, id } = e.currentTarget;
    setGlobalFilter({ value, type: id });

    const setValue = value.toLowerCase();
    if (id === PLAYER_INPUT) {
      setPlayerQuery(setValue);
    } else if (id === YEAR_INPUT) {
      setYearQuery(setValue);
    }
  };

  const handleGmChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    setGlobalFilter({ value: filterValue, type: GM_INPUT });
    setGmQuery(filterValue.toLowerCase());
  };

  const handleBaseballTypeChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    setGlobalFilter({ value: filterValue, type: BASEBALL_TYPE_INPUT });
    setBaseballTypeQuery(filterValue.toLowerCase());
  };

  const handlePositionChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    setGlobalFilter({ value: filterValue, type: POSITION_INPUT });
    setPositionQuery(filterValue.toLowerCase());
  };

  const handlePerGameChange = (e) => {
    if (e.target.checked) {
      setPerGameQuery("true");
    } else {
      setPerGameQuery("");
    }
  };

  // Check if styled components are passed in as props, otherwise, use Table default
  const TableComponent = table ?? T.Table;
  const TableHeadComponent = tableHead ?? T.TableHead;
  const TableHeadRowComponent = tableHeadRow ?? T.TableHeadRow;
  const TableBodyComponent = tableBody ?? T.TableBody;
  const TableBodyRowComponent = tableBodyRow ?? T.TableBodyRow;
  const TableBodyCellComponent = tableBodyCell ?? T.TableBodyCell;

  return (
    <S.TableContainer>
      <S.InputContainer>
        {sport === "basketball" && (
          <>
            <G.FlexRow>
              <p>Per Game Toggle</p>
              <G.HorizontalSpacer factor={1} />
              <Toggle icons={false} onChange={handlePerGameChange} />
            </G.FlexRow>
            <G.HorizontalSpacer factor={4} />
          </>
        )}
        <S.TextInput
          id={PLAYER_INPUT}
          type="text"
          placeholder="Search by Player"
          onChange={handleFilterInputChange}
        />
        {sport === "baseball" && (
          <>
            <Select
              placeholder="Hitter/Pitcher"
              defaultValue={baseballTypeQuery}
              onChange={handleBaseballTypeChange}
              options={[
                { value: "", label: "All" },
                { value: "hitter", label: "Hitter" },
                { value: "pitcher", label: "Pitcher" },
              ]}
              styles={X.TransactionsHistoryDropdownCustomStyles}
              isSearchable={false}
            />
            <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
          </>
        )}
        <Select
          placeholder="Select Position"
          defaultValue={positionQuery}
          onChange={handlePositionChange}
          options={positionsOptions}
          styles={X.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
        <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
        {/* <S.TextInput
          id={YEAR_INPUT}
          type="text"
          placeholder="Search by Year"
          onChange={handleFilterInputChange}
        /> */}
        <Select
          placeholder="Select GM"
          defaultValue={gmQuery}
          onChange={handleGmChange}
          options={gmOptions}
          styles={X.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
      </S.InputContainer>
      <T.ScrollTable>
        <TableComponent style={{ width: "100%" }} {...getTableProps()}>
          <TableHeadComponent>
            {headerGroups.map((headerGroup) => {
              return (
                <TableHeadRowComponent {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                    const TableHeaderCellComponent =
                      column?.tableHeaderCell ?? T.TableHeaderCell;
                    return (
                      <TableHeaderCellComponent
                        {...column.getHeaderProps(
                          column.getSortByToggleProps({ title: undefined })
                        )}
                        doNotStickFirstColumn
                      >
                        <G.FlexRow>
                          <S.HeaderText>{column.render("Header")}</S.HeaderText>
                          <T.TableHeaderSortSpan>
                            {column.isSorted ? (
                              column.isSortedDesc ? (
                                <T.SortIcon icon="caret-square-down" />
                              ) : (
                                <T.SortIcon icon="caret-square-up" />
                              )
                            ) : (
                              ""
                            )}
                          </T.TableHeaderSortSpan>
                        </G.FlexRow>
                      </TableHeaderCellComponent>
                    );
                  })}
                </TableHeadRowComponent>
              );
            })}
          </TableHeadComponent>
          <TableBodyComponent {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <TableBodyRowComponent {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableBodyCellComponent
                        {...cell.getCellProps()}
                        doNotStickFirstColumn
                      >
                        {cell.render((c) => {
                          if (
                            EXCLUDED_PER_GAME_HEADERS.includes(
                              c.column.Header
                            ) ||
                            perGameQuery === ""
                          ) {
                            return c.value;
                          } else {
                            return (c.value / c.row.values.gamesPlayed).toFixed(
                              1
                            );
                          }
                        })}
                      </TableBodyCellComponent>
                    );
                  })}
                </TableBodyRowComponent>
              );
            })}
          </TableBodyComponent>
        </TableComponent>
      </T.ScrollTable>
    </S.TableContainer>
  );
};
