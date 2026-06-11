import { ERA_0, ERA_1, GLOBAL_VARIABLES, TRIFECTA } from "../APIConstants.js";
import { MongoClient, ServerApiVersion } from "mongodb";

const CONNECTION_URI =
  "mongodb+srv://wesley:centerfield8@trifectacluster1.kslbp.mongodb.net/?appName=TrifectaCluster1";

export const returnMongoCollection = async (
  collectionName,
  dynastyEra = ERA_1,
) => {
  const client = new MongoClient(CONNECTION_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  let dbName;
  switch (dynastyEra) {
    case ERA_0:
      dbName = "dynasty1";
      break;
    case TRIFECTA:
      dbName = "trifecta";
      break;
    case ERA_1:
    default:
      dbName = "dynasty-1";
      break;
  }

  if (collectionName === GLOBAL_VARIABLES) {
    dbName = GLOBAL_VARIABLES;
  }

  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    if (collectionName === GLOBAL_VARIABLES) {
      console.log(
        'Pinged the deployment. You\"ve successfully connected to MongoDB!',
      );
    }
  } catch (err) {
    console.log("ERROR!!!!!", err);
  }

  return client.db(dbName).collection(collectionName);
};
