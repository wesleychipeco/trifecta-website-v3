import React, { useCallback, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";

import * as T from "styles/Table.styles";
import * as S from "styles/TradeHistory.styles";
import * as G from "styles/shared";

const OWNER_INPUT = "owner";
const PLAYER_INPUT = "player";

export const TradeHistoryTable = ({
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
  const [ownerQuery, setOwnerQuery] = useState("");
  const [playerQuery, setPlayerQuery] = useState("");

  const globalFilterFunction = useCallback(
    (rows, _id, _query) => {
      return rows.filter(
        (row) =>
          (row.values["owner1"].toLowerCase().includes(ownerQuery) ||
            row.values["owner2"].toLowerCase().includes(ownerQuery)) &&
          (row.values["owner1PlayersReceived"]
            .toString()
            .toLowerCase()
            .replace(".", "") // remove periods (ex: T.J. Warren)
            .includes(playerQuery) ||
            row.values["owner2PlayersReceived"]
              .toString()
              .toLowerCase()
              .replace(".", "") // remove periods (ex: T.J. Warren)
              .includes(playerQuery))
      );
    },
    [ownerQuery, playerQuery]
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

    if (id === OWNER_INPUT) {
      setOwnerQuery(value.toLowerCase());
    } else {
      setPlayerQuery(value.toLowerCase());
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
          id={OWNER_INPUT}
          type="text"
          placeholder="Search By Owner"
          onChange={handleFilterInputChange}
        />
        <S.TextInput
          id={PLAYER_INPUT}
          type="text"
          placeholder="Search By Asset"
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
                          if (Array.isArray(c.value)) {
                            return c.value.map((each) => (
                              <div key={each}>
                                + {each}
                                <br />
                              </div>
                            ));
                          }
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
