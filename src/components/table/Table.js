import React, { useEffect, useState } from "react";
import { useSortBy, useTable } from "react-table";

import * as S from "./Table.styles";
import * as G from "styles/shared";

export const Table = ({
  columns,
  data,
  table = null,
  tableHead = null,
  tableBody = null,
  tableHeadRow = null,
  tableBodyRow = null,
  tableBodyCell = null,
  sortBy = [],
  top3Styling = false,
}) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy,
      },
    },
    useSortBy
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  // Check if styled components are passed in as props, otherwise, use Table default
  const TableComponent = table ?? S.Table;
  const TableHeadComponent = tableHead ?? S.TableHead;
  const TableHeadRowComponent = tableHeadRow ?? S.TableHeadRow;
  const TableBodyComponent = tableBody ?? S.TableBody;
  const TableBodyRowComponent = tableBodyRow ?? S.TableBodyRow;
  const TableBodyCellComponent = tableBodyCell ?? S.TableBodyCell;

  const [top3Array, setTop3Array] = useState([]);

  useEffect(() => {
    const sortedRows = tableInstance?.sortedRows ?? [];
    if (top3Styling && sortedRows.length > 0) {
      const top3 = [];
      for (let i = 0; i < 3; i++) {
        top3.push(sortedRows[i].index);
      }
      // only update if top3 from sorted rows and top3Array state is different
      if (
        top3?.[0] !== top3Array?.[0] ||
        top3?.[1] !== top3Array?.[1] ||
        top3?.[2] !== top3Array?.[2]
      ) {
        setTop3Array(top3);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]); // only calculate when data changes (which should only be when first available)

  return (
    <TableComponent {...getTableProps()}>
      <TableHeadComponent>
        {headerGroups.map((headerGroup) => {
          return (
            <TableHeadRowComponent {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                const TableHeaderCellComponent =
                  column?.tableHeaderCell ?? S.TableHeaderCell;
                return (
                  <TableHeaderCellComponent
                    {...column.getHeaderProps(
                      column.getSortByToggleProps({ title: undefined })
                    )}
                  >
                    <G.FlexRow>
                      {column.render("Header")}
                      <S.TableHeaderSortSpan>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <S.SortIcon icon="caret-square-down" />
                          ) : (
                            <S.SortIcon icon="caret-square-up" />
                          )
                        ) : (
                          ""
                        )}
                      </S.TableHeaderSortSpan>
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
            <TableBodyRowComponent
              {...row.getRowProps()}
              top3Styling={top3Styling}
              top3Array={top3Array}
              index={row.index}
            >
              {row.cells.map((cell) => {
                let win, points;
                if (
                  typeof cell.value === "string" &&
                  cell.value.indexOf("###") !== -1
                ) {
                  [points, win] = cell.value.split("###");
                }
                return (
                  <TableBodyCellComponent {...cell.getCellProps()} win={win}>
                    {cell.render((c) => {
                      if (Array.isArray(c.value)) {
                        return c.value.map((each) => (
                          <div key={each}>
                            {each}
                            <br />
                          </div>
                        ));
                      }
                      if (
                        typeof c.value === "string" &&
                        c.value.indexOf("###") !== -1
                      ) {
                        [points] = c.value.split("###");
                        return points;
                      }
                      return c?.value ?? "Error";
                    })}
                  </TableBodyCellComponent>
                );
              })}
            </TableBodyRowComponent>
          );
        })}
      </TableBodyComponent>
    </TableComponent>
  );
};
