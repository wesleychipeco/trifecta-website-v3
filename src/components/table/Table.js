import React from "react";
import { useSortBy, useTable } from "react-table";

import * as S from "./Table.styles";
import * as G from "../../styles/shared";

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
            <TableBodyRowComponent {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <TableBodyCellComponent {...cell.getCellProps()}>
                    {cell.render((c) => {
                      if (Array.isArray(c.value)) {
                        return c.value.map((each) => (
                          <div key={each}>
                            {each}
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
  );
};
