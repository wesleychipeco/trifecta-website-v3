import { useEffect, useMemo, useState } from "react";
import * as S from "styles/TradeHistory.styles";
import { TradeHistoryTable } from "components/table/TradeHistoryTable";
import { api } from "utils/api";

export const DynastyTradeHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.get("/trade-history");
      setTradeHistory(data);
    };
    load();
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "date",
        tableHeaderCell: S.DateTableHeaderCell,
      },
      {
        Header: "GM 1",
        accessor: "owner1",
        tableHeaderCell: S.OwnersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "GM 1 Assets Received",
        accessor: "owner1PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "GM 2",
        accessor: "owner2",
        tableHeaderCell: S.OwnersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "GM 2 Assets Received",
        accessor: "owner2PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
        disableSortBy: true,
      },
    ],
    [],
  );

  return (
    <S.Container>
      <S.Title>Dynasty Trade History</S.Title>
      <TradeHistoryTable
        columns={columns}
        data={tradeHistory}
        tableBodyCell={S.TradeHistoryTableBodyCell}
        sortBy={[{ id: "date", desc: true }]}
      />
    </S.Container>
  );
};
