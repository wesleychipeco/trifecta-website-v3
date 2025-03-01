import React, { useCallback, useMemo, useState } from "react";
import { useGlobalFilter, useSortBy, useTable } from "react-table";
import Select from "react-select";
import { TailSpin } from "react-loader-spinner";

import * as S from "styles/PlayerStats.styles";
import * as T from "styles/Table.styles";
import * as G from "styles/shared";
import * as X from "styles/TransactionsHistory.styles";
import { extractBetweenParentheses } from "utils/strings";
import Toggle from "react-toggle";
import {
  BASEBALL_POSITIONS_OPTIONS,
  BASKETBALL_POSITIONS_OPTIONS,
  FOOTBALL_POSITIONS_OPTIONS,
} from "./StatsColumns";
import { BASEBALL, BASKETBALL, FOOTBALL } from "Constants";

const PLAYER_INPUT = "player";
const GM_INPUT = "gm";
const POSITION_INPUT = "position";
const YEAR_INPUT = "year";
const BASEBALL_TYPE_INPUT = "type";
const DISPLAY_TOTAL_STATS_INITIALLY = true; // true = display total stats initially on page load

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
  sport,
  columns,
  data,
  table = null,
  tableHead = null,
  tableBody = null,
  tableHeadRow = null,
  tableBodyRow = null,
  tableBodyCell = null,
  gmsArray = [],
  isMobile = false,
  isLoading = false,
  yearsArray = [],
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
      case BASKETBALL:
        return BASKETBALL_POSITIONS_OPTIONS;
      case BASEBALL:
        return BASEBALL_POSITIONS_OPTIONS;
      case FOOTBALL:
        return FOOTBALL_POSITIONS_OPTIONS;
      default:
        return BASKETBALL_POSITIONS_OPTIONS;
    }
  }, [sport]);

  const yearsOptions = useMemo(() => {
    const yearsArrayOptions = yearsArray.map((year) => {
      let label = year;
      if (year === "all") {
        label = "All Individual Seasons";
      } else if (year === "total") {
        label = "All Seasons Totaled";
      }
      return {
        value: year,
        label,
      };
    });
    return yearsArrayOptions;
  }, [yearsArray]);

  const hitterPitcherOptions = useMemo(() => {
    return [
      { value: "", label: "All" },
      { value: "hitter", label: "Hitter" },
      { value: "pitcher", label: "Pitcher" },
    ];
  }, []);

  const footballStatsWidthScrollStyle = useMemo(() => {
    return sport === FOOTBALL
      ? { overflow: "auto", width: "100%", paddingLeft: "5px" }
      : {};
  }, [sport]);

  const [playerQuery, setPlayerQuery] = useState("");
  const [gmQuery, setGmQuery] = useState("");
  const [positionQuery, setPositionQuery] = useState("");
  const [yearQuery, setYearQuery] = useState("");
  const [perGameQuery, setPerGameQuery] = useState("");
  const [baseballTypeQuery, setBaseballTypeQuery] = useState("");
  const [totalQuery, setTotalQuery] = useState(DISPLAY_TOTAL_STATS_INITIALLY);

  const initialSortByArray = useMemo(() => {
    return sport === FOOTBALL
      ? [{ id: "fantasyPoints", desc: true }]
      : [{ id: "gamesPlayed", desc: true }];
  }, [sport]);

  const initialFilterArray = useMemo(() => {
    return [
      {
        id: "isTotalRecord",
        value: DISPLAY_TOTAL_STATS_INITIALLY,
      },
    ];
  }, []);

  const globalFilterFunction = useCallback(
    (rows, _id, _query) => {
      return rows.filter((row) => {
        const name = row.values?.name ?? "";
        const gmName = row.values?.gmName ?? "";
        const position = row.values?.position ?? "";
        const year = row.values?.year ?? "";
        const type = row.values?.type ?? "";
        const total = row.values?.isTotalRecord ?? false;
        return (
          name.toLowerCase().includes(playerQuery) &&
          gmName.toLowerCase().includes(gmQuery) &&
          position.toLowerCase().includes(positionQuery) &&
          year.toLowerCase().includes(yearQuery) &&
          type.toLowerCase().includes(baseballTypeQuery) &&
          total === totalQuery
        );
      });
    },
    [
      playerQuery,
      gmQuery,
      positionQuery,
      yearQuery,
      baseballTypeQuery,
      totalQuery,
    ]
  );

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: {
        sortBy: initialSortByArray,
        hiddenColumns: ["type", "isTotalRecord"],
        globalFilter: initialFilterArray,
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
    }
  };

  const handleYearsChange = (selectedOption) => {
    const filterValue = selectedOption?.value ?? "";
    if (filterValue === "all") {
      setYearQuery("");
      setTotalQuery(false);
    } else if (filterValue === "total") {
      setYearQuery("");
      setTotalQuery(true);
    } else {
      setYearQuery(filterValue.toLowerCase());
      setTotalQuery(false);
    }
    setGlobalFilter({ value: filterValue, type: YEAR_INPUT });
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
        <S.TextInput
          id={PLAYER_INPUT}
          type="text"
          placeholder="Search by Player"
          onChange={handleFilterInputChange}
        />
        {sport === BASKETBALL && (
          <>
            <G.FlexRow>
              <p>Per Game Toggle</p>
              <G.HorizontalSpacer factor={1} />
              <Toggle icons={false} onChange={handlePerGameChange} />
            </G.FlexRow>
            <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
          </>
        )}
        {sport === BASEBALL && (
          <>
            <Select
              placeholder="Hitter/Pitcher"
              defaultValue={baseballTypeQuery}
              onChange={handleBaseballTypeChange}
              options={hitterPitcherOptions}
              styles={X.TransactionsHistoryDropdownCustomStyles}
              isSearchable={false}
            />
            <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
          </>
        )}
        <Select
          placeholder="All Seasons Totaled" // change if DISPLAY_TOTAL_STATS_INITIALLY changes
          defaultValue={yearQuery}
          onChange={handleYearsChange}
          options={yearsOptions}
          styles={X.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
        <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
        <Select
          placeholder="Select Position"
          defaultValue={positionQuery}
          onChange={handlePositionChange}
          options={positionsOptions}
          styles={X.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
        <G.HorizontalSpacer factor={isMobile ? 0 : 8} />
        <Select
          placeholder="Select GM"
          defaultValue={gmQuery}
          onChange={handleGmChange}
          options={gmOptions}
          styles={X.TransactionsHistoryDropdownCustomStyles}
          isSearchable={false}
        />
      </S.InputContainer>
      {totalQuery && sport === BASKETBALL && (
        <S.TotalsCaption>
          FG% and FT% totals across seasons are not available.
        </S.TotalsCaption>
      )}

      <T.ScrollTable style={footballStatsWidthScrollStyle}>
        <TableComponent {...getTableProps()}>
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
            {isLoading && (
              <tr>
                <td>
                  <TailSpin
                    visible={true}
                    height="80"
                    width="80"
                    color="black"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                    }}
                    wrapperClass=""
                  />
                </td>
              </tr>
            )}
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
