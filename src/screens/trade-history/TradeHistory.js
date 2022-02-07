import { useEffect, useMemo, useState } from "react";
import { useTable } from "react-table";
import { Table } from "../../components/table/Table";
import { returnMongoCollection } from "../../database-management";

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
      },
      {
        Header: "Owner 1",
        accessor: "owner1",
      },
      {
        Header: "Owner 1 Players Received",
        accessor: "owner1PlayersReceived",
      },
      {
        Header: "Owner 2",
        accessor: "owner2",
      },
      {
        Header: "Owner 2 Players Received",
        accessor: "owner2PlayersReceived",
      },
    ],
    []
  );

  return (
    <div>
      <h2>Trade History Screen</h2>
      <Table columns={columns} data={tradeHistory} />
    </div>
  );
};
