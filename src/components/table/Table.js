import React from "react";
import { useTable } from "react-table";

import * as S from "./Table.styles";

export const Table = ({
  columns,
  data,
  table = null,
  tableHead = null,
  tableBody = null,
  tableHeadRow = null,
  tableBodyRow = null,
  tableBodyCell = null,
}) => {
  const tableInstance = useTable({ columns, data });
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
                  <TableHeaderCellComponent {...column.getHeaderProps()}>
                    {column.render("Header")}
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
