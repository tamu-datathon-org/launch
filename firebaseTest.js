// https://firebase.google.com/docs/firestore/quickstart
const admin = require('firebase-admin');

const serviceAccount = require("./service-account-file.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-f271e.firebaseio.com/"
});

// const db = admin.firestore();

// (async () => {
//     const snapshot = await db.collection('applications').get();
//     snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//     });
// })();

const db = admin.database();
const ref = db.ref("deadline");
// (async () => {
//     const result = await ref.once("value");
//     console.log(result.val());
// })();


ref.set("11/22/2020, 8:32:51 PM")

