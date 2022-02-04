import { useEffect, useState } from "react";
import { returnMongoCollection } from "../../database-management";

export const TradeHistory = () => {
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    const load = async () => {
      const coll = await returnMongoCollection("tradeHistory");
      const ok = await coll.find({});
      setDisplay(ok);
    };
    load();
  }, []);

  return (
    <div>
      <h2>Trade History Screen</h2>
      {display.map((each) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          {each["date"]}
          {each["owner1"]}
          {each["owner1PlayersReceived"]}
          {each["owner2"]}
          {each["owner2PlayersReceived"]}
        </div>
      ))}
    </div>
  );
};
