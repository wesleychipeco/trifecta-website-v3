import { ERA_0, ERA_1, GLOBAL_VARIABLES, TRIFECTA } from "../APIConstants.js";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as dotenv from "dotenv";

dotenv.config();
const CONNECTION_URI = process.env.MONGODB_URI;

// Singleton client + connection promise, created once per process
let client;
let clientPromise;

const getClient = () => {
  if (!client) {
    client = new MongoClient(CONNECTION_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
      maxPoolSize: 25,
    });
    clientPromise = client.connect().then(async (connectedClient) => {
      await connectedClient.db().command({ ping: 1 });
      console.log(
        "Pinged the deployment. You've successfully connected to MongoDB!",
      );
      return connectedClient;
    });
  }
  return clientPromise;
};

export const returnMongoCollection = async (
  collectionName,
  dynastyEra = ERA_1,
) => {
  const connectedClient = await getClient();

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

  return connectedClient.db(dbName).collection(collectionName);
};
