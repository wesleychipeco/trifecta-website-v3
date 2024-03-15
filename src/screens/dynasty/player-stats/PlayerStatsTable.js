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

export const PlayerStatsTable = ({
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
}) => {
  const gmOptions = useMemo(() => {
    const onlyGmsArray = gmsArray.map((gm) => ({
      value: extractBetweenParentheses(gm),
      label: gm,
    }));
    onlyGmsArray.unshift({ value: "", label: "All GMs" });
    return onlyGmsArray;
  }, [gmsArray]);

  const [playerQuery, setPlayerQuery] = useState("");
  const [gmQuery, setGmQuery] = useState("");
  const [positionQuery, setPositionQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");
  const [perGameQuery, setPerGameQuery] = useState("");

  const globalFilterFunction = useCallback(
    (rows, _id, _query) => {
      return rows.filter((row) => {
        return (
          row.values["name"].toLowerCase().includes(playerQuery) &&
          row.values["gmName"].toLowerCase().includes(gmQuery) &&
          row.values["position"].toLowerCase().includes(positionQuery) &&
          row.values["year"].toLowerCase().includes(yearQuery)
        );
      });
    },
    [playerQuery, gmQuery, positionQuery, yearQuery]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy,
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
    } else {
      setPositionQuery(setValue);
    }
  };

  const handleGmChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    setGlobalFilter({ value: filterValue, type: GM_INPUT });
    setGmQuery(filterValue.toLowerCase());
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
        <G.FlexRow>
          <p>Per Game Toggle</p>
          <G.HorizontalSpacer factor={1} />
          <Toggle icons={false} onChange={handlePerGameChange} />
        </G.FlexRow>
        <G.HorizontalSpacer factor={4} />
        <S.TextInput
          id={PLAYER_INPUT}
          type="text"
          placeholder="Search by Player"
          onChange={handleFilterInputChange}
        />
        <S.TextInput
          id={POSITION_INPUT}
          type="text"
          placeholder="Search by Position"
          onChange={handleFilterInputChange}
        />
        <S.TextInput
          id={YEAR_INPUT}
          type="text"
          placeholder="Search by Year"
          onChange={handleFilterInputChange}
        />
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
                            if (
                              c.column.Header === "FG%" ||
                              c.column.Header === "FT%"
                            ) {
                              return c.value.toFixed(3);
                            }
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
