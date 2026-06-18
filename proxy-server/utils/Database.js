import { ERA_0, ERA_1, GLOBAL_VARIABLES, TRIFECTA } from "../APIConstants.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();
const CONNECTION_URI = process.env.MONGODB_URI;

// module-level singleton
let cachedClient = null;

const getClient = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(CONNECTION_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  await client.connect();
  cachedClient = client;
  return cachedClient;
};

export const returnMongoCollection = async (
  collectionName,
  dynastyEra = ERA_1,
) => {
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
    const client = await getClient();
    return client.db(dbName).collection(collectionName);
  } catch (err) {
    console.log("ERROR!!!!!", err);
    cachedClient = null;
    throw err;
  }
};
