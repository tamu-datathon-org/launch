const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

const DevpostService = require('./services/DevpostService');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.replenishDevpostData = functions.firestore.document('applications/{docId}').onWrite(async (change, context) => { 
    const { after, before } = change;

    const oldDevpostUrl = before && before.data() && before.data().devpostURL;
    const newDevpostUrl = after && after.data() && after.data().devpostURL;
    
    if (oldDevpostUrl !== newDevpostUrl) {
        console.log({ oldDevpostUrl, newDevpostUrl });
        const devpostUsername = DevpostService.getUsernameFromUrl(newDevpostUrl);
        if (!devpostUsername) return;
        const projects = await DevpostService.getUsersProjects(devpostUsername);
        const hackathons = await DevpostService.getUsersAttendedHackathons(devpostUsername);

        await admin.firestore().doc(`applications/${context.params.docId}`).update({
            devpostData: {
                projects,
                hackathons
            }
        });
        console.log("Updated Doc!");
    }
});