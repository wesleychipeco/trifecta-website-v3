import * as Realm from "realm-web";

const REALM_APP_ID = "trifectafantasyleague-xqqjr";
const REALM_SERVICE = "mongodb-atlas";
// const REALM_DB_NAME = "trifecta";

export const returnMongoCollection = async (
  collectionName,
  isDynasty = false
) => {
  const REALM_DB_NAME = isDynasty ? "dynasty" : "trifecta";
  const app = Realm.App.getApp(REALM_APP_ID);
  if (!app.currentUser) {
    await app.logIn(Realm.Credentials.anonymous());
  }
  const mongodb = app.currentUser.mongoClient(REALM_SERVICE);
  return mongodb.db(REALM_DB_NAME).collection(collectionName);
};
