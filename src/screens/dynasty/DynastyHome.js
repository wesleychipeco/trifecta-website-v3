import { useEffect, useState } from "react";
import { returnMongoCollection } from "database-management";

export const DynastyHome = () => {
  const [dynastyStuff, setDynastyStuff] = useState([]);

  useEffect(() => {
    const load = async () => {
      const collection = await returnMongoCollection("gms", true);
      const data = await collection.find({});
      setDynastyStuff(data);
    };

    load();
  }, []);

  return (
    <div>
      <h1>This is the dynasty landing page</h1>
      {dynastyStuff.map((each) => (
        <div key={each.name}>
          <div>{`Name: ${each.name}`}</div>
          <div>{`Letter: ${each.letter}`}</div>
        </div>
      ))}
    </div>
  );
};
