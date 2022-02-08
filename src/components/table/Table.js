import React from "react";
import { useTable } from "react-table";

import * as S from "./Table.styles";

export const Table = ({ columns, data }) => {
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <S.Table {...getTableProps()}>
      <S.TableHead>
        {headerGroups.map((headerGroup) => (
          <S.TableHeaderRow {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <S.TableHeaderCell {...column.getHeaderProps()}>
                {column.render("Header")}
              </S.TableHeaderCell>
            ))}
          </S.TableHeaderRow>
        ))}
      </S.TableHead>
      <S.TableBody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <S.TableBodyRow {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <S.TableBodyCell {...cell.getCellProps()}>
                    {cell.render((c) => {
                      if (Array.isArray(c.value)) {
                        return c.value.map((each) => (
                          <>
                            {each}
                            <br />
                          </>
                        ));
                      }
                      return c.value;
                    })}
                  </S.TableBodyCell>
                );
              })}
            </S.TableBodyRow>
          );
        })}
      </S.TableBody>
    </S.Table>
  );
};
