import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});
const db = admin.firestore();

export const refreshData = functions.https.onRequest((request, response) => {
  const collectionsAllowed = [
    "ticker_all",
    "ticker_all_staging",
    "market_summary",
    "market_summary_staging",
  ];
  const collection = collectionsAllowed.find((collection) => collection === request.body.collection);
  if (!collection) {
    response.status(404).json({message: "Not found collection " + request.body.collection});
  } else {
    const data: any = request.body.data;
    if (data && data.length) for (const item of data) db.collection(collection).doc(item.symbol.replace('/', '_')).set(item);
    response.status(200).json({message: "Updated or created data"});
  }
});
