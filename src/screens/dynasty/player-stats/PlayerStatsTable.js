import React, { useCallback, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import * as S from "styles/PlayerStats.styles";
import * as T from "styles/Table.styles";
import * as G from "styles/shared";

const PLAYER_INPUT = "player";
const GM_INPUT = "gm";
const POSITION_INPUT = "position";
const YEAR_INPUT = "year";

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
}) => {
  const [playerQuery, setPlayerQuery] = useState("");
  const [gmQuery, setGmQuery] = useState("");
  const [positionQuery, setPositionQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");

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
    } else if (id === GM_INPUT) {
      setGmQuery(setValue);
    } else if (id === YEAR_INPUT) {
      setYearQuery(setValue);
    } else {
      setPositionQuery(setValue);
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
        <S.TextInput
          id={GM_INPUT}
          type="text"
          placeholder="Search by GM"
          onChange={handleFilterInputChange}
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
                            {columns.isSorted ? (
                              columns.isSortedDesc ? (
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
                          // console.log("cccccccc", c);
                          return c.value;
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
