import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});
const db = admin.firestore();

export const refreshData = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Created or updated data", {
    structuredData: true,
    body: request.body,
  });
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
    const data = request.body.data;
    if (data && data.length) await db.collection(collection).doc('info').set({data});
    response.status(200).json({message: "Updated or created data"});
  }
});
