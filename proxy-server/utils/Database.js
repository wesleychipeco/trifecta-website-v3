import { ERA_0, ERA_1, GLOBAL_VARIABLES, TRIFECTA } from "../APIConstants.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();
const CONNECTION_URI = process.env.MONGODB_URI;

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
    maxPoolSize: 25,
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
