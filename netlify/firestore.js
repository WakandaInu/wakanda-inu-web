const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./wakanda-inu-firebase-adminsdk-uvjf5-4596bc3ccc.json");

initializeApp({
  credential: cert(serviceAccount),
});

module.exports = { getFirestore };
