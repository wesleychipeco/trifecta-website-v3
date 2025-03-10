import { ERA_0, ERA_1, GLOBAL_VARIABLES } from "../APIConstants.js";
import * as Realm from "realm-web";

const REALM_APP_ID = "trifectafantasyleague-xqqjr";
const REALM_SERVICE = "mongodb-atlas";

export const returnMongoCollection = async (
  collectionName,
  dynastyEra = ERA_1
) => {
  let dbName;
  switch (dynastyEra) {
    case ERA_0:
      dbName = "dynasty1";
      break;
    case ERA_1:
      dbName = "dynasty-1";
      break;
    default:
      dbName = "trifecta";
      break;
  }

  if (collectionName === GLOBAL_VARIABLES) {
    dbName = GLOBAL_VARIABLES;
  }

  const app = Realm.App.getApp(REALM_APP_ID);
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongodb = app.currentUser.mongoClient(REALM_SERVICE);
  return mongodb.db(dbName).collection(collectionName);
};
