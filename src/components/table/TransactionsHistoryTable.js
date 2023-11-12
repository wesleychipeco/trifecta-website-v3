import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import { useMediaQuery } from "react-responsive";
import Select from "react-select";
import Toggle from "react-toggle";

import * as T from "styles/Table.styles";
import * as S from "styles/TransactionsHistory.styles";
import * as G from "styles/shared";
import { MOBILE_MAX_WIDTH } from "styles/global";
import "./ToggleStyles.css"; // for ES6 modules
import { extractBetweenParentheses } from "utils/strings";

const GM_INPUT = "gm";
const PLAYER_INPUT = "player";
const IS_SUCCESSFUL_INPUT = "isSuccessful";

export const TransactionsHistoryTable = ({
  columns,
  data,
  table = null,
  tableHead = null,
  tableBody = null,
  tableHeadRow = null,
  tableBodyRow = null,
  tableBodyCell = null,
  sortBy = [],
  hiddenColumns = [],
  gmsArray = [],
}) => {
  const [isMobile] = useState(useMediaQuery({ query: MOBILE_MAX_WIDTH }));

  const [gmQuery, setGmQuery] = useState("");
  const [playerQuery, setPlayerQuery] = useState("");
  const [isSuccessfulQuery, setIsSuccessfulQuery] = useState("true");

  const handleFilterInputChange = (e) => {
    const { value, id } = e.currentTarget;
    setGlobalFilter({ value, type: id });
    setPlayerQuery(value.toLowerCase());
  };

  const handleGmChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    setGlobalFilter({ value: filterValue, type: GM_INPUT });
    setGmQuery(filterValue);
  };

  const handleIsSuccessfulChange = (e) => {
    if (e.target.checked) {
      setIsSuccessfulQuery("");
      setGlobalFilter({ value: "", type: IS_SUCCESSFUL_INPUT });
    } else {
      setIsSuccessfulQuery("true");
      setGlobalFilter({ value: "true", type: IS_SUCCESSFUL_INPUT });
    }
  };

  const globalFilterFunction = useCallback(
    (rows, _id, _query) => {
      return rows.filter(
        (row) =>
          row.values["gm"].includes(gmQuery) &&
          row.values["playerDisplay"]
            .toString()
            .toLowerCase()
            .replace(".", "") // remove periods (ex: T.J. Warren)
            .includes(playerQuery) &&
          row.values["isSuccessful"]
            .toString()
            .toLowerCase()
            .includes(isSuccessfulQuery)
      );
    },
    [gmQuery, playerQuery, isSuccessfulQuery, data]
  );

  const gmOptions = useMemo(() => {
    const onlyGmsArray = gmsArray.map((gm) => ({
      value: extractBetweenParentheses(gm),
      label: gm,
    }));
    onlyGmsArray.unshift({ value: "", label: "All GMs" });
    return onlyGmsArray;
  }, [gmsArray]);

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy,
        hiddenColumns,
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

  useEffect(() => {
    // first time render
    setIsSuccessfulQuery("true");
    setGlobalFilter({ value: "true", type: IS_SUCCESSFUL_INPUT });
  }, [data]);

  // Check if styled components are passed in as props, otherwise, use Table default
  const TableComponent = table ?? T.Table;
  const TableHeadComponent = tableHead ?? T.TableHead;
  const TableHeadRowComponent = tableHeadRow ?? T.TableHeadRow;
  const TableBodyComponent = tableBody ?? T.TableBody;
  const TableBodyRowComponent = tableBodyRow ?? T.TableBodyRow;
  const TableBodyCellComponent = tableBodyCell ?? T.TableBodyCell;

  const AddedPlayerComponent = (props) => {
    return (
      <G.FlexRow>
        <S.IconContainer>
          <FontAwesomeIcon icon="fa-plus" size={isMobile ? "sm" : "lg"} />
        </S.IconContainer>
        {props.addedPlayer}
      </G.FlexRow>
    );
  };

  const DroppedPlayerComponent = (props) => {
    return (
      <G.FlexRow>
        <S.IconContainer isDrop>
          <FontAwesomeIcon icon="fa-minus" size={isMobile ? "sm" : "lg"} />
        </S.IconContainer>
        {props.droppedPlayer}
      </G.FlexRow>
    );
  };

  return (
    <S.TransactionsHistoryOuterContainer>
      <S.InputContainer>
        <Select
          placeholder="Select GM"
          defaultValue={gmQuery}
          onChange={handleGmChange}
          options={gmOptions}
          styles={S.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
        <S.TextInput
          id={PLAYER_INPUT}
          type="text"
          placeholder="Search By Player"
          onChange={handleFilterInputChange}
        />
        <G.FlexRow>
          <Toggle icons={false} onChange={handleIsSuccessfulChange} />
          <G.HorizontalSpacer factor={1} />
          <G.FlexColumn style={{ alignItems: "flex-start" }}>
            Include Unsuccessful Transactions
            <br />
            <G.FlexRow>
              Hover <G.HorizontalSpacer factor={1} />
              <FontAwesomeIcon
                icon="fa-times-circle"
                size={isMobile ? "sm" : "xl"}
                color="red"
              />{" "}
              <G.HorizontalSpacer factor={1} />
              for Reason
            </G.FlexRow>
          </G.FlexColumn>
        </G.FlexRow>
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
                      <TableBodyCellComponent {...cell.getCellProps()}>
                        {cell.render((c) => {
                          // handle undefined and null values
                          if (c.value === undefined || c.value === null) {
                            return null;
                          }

                          // isSuccessful
                          if (typeof c.value === "boolean") {
                            if (c.value) {
                              return (
                                <G.FlexColumnCentered>
                                  <FontAwesomeIcon
                                    icon="fa-check-circle"
                                    size={isMobile ? "sm" : "xl"}
                                    color="green"
                                  />
                                </G.FlexColumnCentered>
                              );
                            }
                            // if not successful
                            return (
                              <G.FlexColumnCentered>
                                <S.TooltipContainer className="hover-text">
                                  <FontAwesomeIcon
                                    icon="fa-times-circle"
                                    size={isMobile ? "sm" : "xl"}
                                    color="red"
                                  />
                                  <S.TooltipText className="tooltip-text">
                                    {c?.row?.values?.isSuccessfulReason}
                                  </S.TooltipText>
                                </S.TooltipContainer>
                              </G.FlexColumnCentered>
                            );
                          }

                          // faabTiebreakers
                          if (Array.isArray(c.value) && c.value.length > 0) {
                            return c.value.map((each, i) => {
                              return (
                                <div key={`${each.gm}-${each.bidOffer}#${i}`}>
                                  + {`${each.gm} - $${each.bidOffer}`}
                                  <br />
                                </div>
                              );
                            });
                          }
                          // date
                          else if (c.value instanceof Date) {
                            return <p>{format(c.value, "MM/dd/yy hh:mm a")}</p>;
                          }
                          // bid offer
                          else if (typeof c.value === "number") {
                            if (c.row.values.transactionType === "Drop") {
                              return <p>----</p>;
                            }
                            return <p>{`$${c.value}`}</p>;
                          }
                          // added & dropped players
                          if (typeof c.value === "string") {
                            if (c.value.includes("#")) {
                              const [added, dropped] = c.value.split("#");
                              return (
                                <>
                                  <AddedPlayerComponent addedPlayer={added} />
                                  <br />
                                  <DroppedPlayerComponent
                                    droppedPlayer={dropped}
                                  />
                                </>
                              );
                            }
                            // just singular added or dropped player
                            else if (c.column.Header === "Player(s)") {
                              if (c.row.values.transactionType === "Claim") {
                                return (
                                  <AddedPlayerComponent addedPlayer={c.value} />
                                );
                              }
                              return (
                                <DroppedPlayerComponent
                                  droppedPlayer={c.value}
                                />
                              );
                            }
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
    </S.TransactionsHistoryOuterContainer>
  );
};
