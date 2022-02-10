import { useEffect, useMemo, useState } from "react";
import { Table } from "../../components/table/Table";
import { returnMongoCollection } from "../../database-management";
import * as S from "./TableHistory.styles";

export const TradeHistory = () => {
  const [tradeHistory, setTradeHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("tradeHistory");
      const data = await collection.find({});
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
      },
      {
        Header: "Owner 1 Players Received",
        accessor: "owner1PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
      },
      {
        Header: "Owner 2",
        accessor: "owner2",
        tableHeaderCell: S.OwnersTableHeaderCell,
      },
      {
        Header: "Owner 2 Players Received",
        accessor: "owner2PlayersReceived",
        tableHeaderCell: S.PlayersTableHeaderCell,
      },
    ],
    []
  );

  return (
    <S.Container>
      <h1>Trade History Screen</h1>
      <Table
        columns={columns}
        data={tradeHistory}
        tableBodyCell={S.TradeHistoryTableBodyCell}
      />
    </S.Container>
  );
};
