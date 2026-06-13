import { useEffect, useMemo, useState } from "react";
import * as S from "styles/TradeHistory.styles";
import { TradeHistoryTable } from "components/table/TradeHistoryTable";
import { api } from "utils/api";

export const TrifectaTradeHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await api.get("/trifecta/trade-history");
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
        Header: "Owner 1",
        accessor: "owner1",
        tableHeaderCell: S.OwnersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "Owner 1 Players Received",
        accessor: "owner1PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "Owner 2",
        accessor: "owner2",
        tableHeaderCell: S.OwnersTableHeaderCell,
        disableSortBy: true,
      },
      {
        Header: "Owner 2 Players Received",
        accessor: "owner2PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
        disableSortBy: true,
      },
    ],
    [],
  );

  return (
    <S.Container>
      <S.Title>Trifecta Trade History</S.Title>
      <TradeHistoryTable
        columns={columns}
        data={tradeHistory}
        tableBodyCell={S.TradeHistoryTableBodyCell}
        sortBy={[{ id: "date", desc: true }]}
      />
    </S.Container>
  );
};
