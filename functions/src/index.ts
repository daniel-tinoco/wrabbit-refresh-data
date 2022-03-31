import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({timestampsInSnapshots: true});
const db = admin.firestore();

export const refreshData = functions.https.onRequest((request, response) => {
  const collectionsAllowed = [
    { name: 'ticker_all', id: 'kayjx9kZE6JRpJ5WZCgw' },
    { name: 'ticker_all_staging', id: 'Qnmm6ZmqgI4vRb1QIMCR' },
    { name: 'market_summary', id: 'PwerdYXavQnUsuk7rCKS' },
    { name: 'market_summary_staging', id: 'ewMsAwtJY5LzvzzunvID' },
  ];
  const collection = collectionsAllowed.find(collection => collection.name === request.body.collection);
  if (!collection) {
    response.status(404).json({ message: 'Not found collection ' + request.body.collection })
  } else {
    db.collection(collection.name).doc(collection.id).update({
      data: request.body.data,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    response.status(200).json({message: "Updated or created data"});
  }
});
