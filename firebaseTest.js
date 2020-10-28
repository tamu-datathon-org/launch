// https://firebase.google.com/docs/firestore/quickstart
const admin = require('firebase-admin');

const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-f271e.firebaseio.com/"
});

// const db = admin.firestore();

// (async () => {
//   const snapshot = await db.collection('users').get();
//   snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
//   });
// })();