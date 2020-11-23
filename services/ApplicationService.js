const admin = require('firebase-admin');
const schools = require('../public/colleges.json');
const majors = require('../public/college-majors.json');
const tech = require('../public/technologies.json');

/**
 * Gets the appication for a specified user.
 * Returns undefined if there is no application
 * @param {string} userId User Auth ID
 */
const getApplicationForUser = async (userId) => {
    const doc = await admin.firestore().collection("applications").doc(userId).get();
    const data = doc.data();
    if (!data)
        return data;
        
    if (data.school)
        data.schoolName = schools.results.find((item) => `${item.id}` == data.school).text || "-unknown-";
    if (data.majors)
        data.majorNames = data.majors.map(id => 
            majors.results.find((majorItem) => `${majorItem.id}` == id).text || "-unknown-"
        );
    if (data.minors)
        data.minorsNames = data.minors.map(id => 
            majors.results.find((majorItem) => `${majorItem.id}` == id).text || "-unknown-"
        );
    if (data.techExperience && Array.isArray(data.techExperience))
        data.techExperienceNames = data.techExperience.map(id => 
            tech.results.find((techItem) => `${techItem.id}` == id).text || "-unknown-"
        );
    return data;
}

/**
 * Creates an Application for a User
 * @param {string} userId User Auth ID
 * @param {object} attributes Initial attributes to set for user
 */
const createApplicationForUser = async (userId, attributes) => {
    return admin.firestore().collection("applications").doc(userId).set({
        status: "SUBMITTED",
        ...attributes,
        userAuthId: userId
    })
}

/**
 * Updates a user application if it exists
 * @param {string} userId User Auth ID
 * @param {object} updatedFields Dictionary with new keys and values
 */
const updateApplicationForUser = async (userId, updatedFields) => {
    return admin.firestore().collection("applications").doc(userId).update(updatedFields);
}

/**
 * Sets the status of an application
 * @param {string} userId 
 * @param {"SUBMITTED" | "WAITLISTED" | "ACCEPTED" | "DENIED"} newStatus 
 */
const setStatusOfApplication = async (userId, newStatus) => {
    if (!["SUBMITTED", "WAITLISTED", "ACCEPTED", "DENIED"].includes(newStatus))
        throw new Error("Invalid Application Status");
    return updateApplicationForUser(userId, {status: newStatus});
}

/**
 * Get the first 10 applications
 */
const getApplicationsPreview = async () => {
    const db = admin.firestore();
    const snapshot = await db.collection('applications').limit(10).get();

    const result = [];

    snapshot.forEach((doc) => {
        if (doc.exists) {
            const data = doc.data();
            if (data.school)
                data.schoolName = schools.results.find((item) => `${item.id}` == data.school).text || "-unknown-";
            if (data.majors)
                data.majorNames = data.majors.map(id => 
                    majors.results.find((majorItem) => `${majorItem.id}` == id).text || "-unknown-"
                );
            if (data.minors)
                data.minorsNames = data.minors.map(id => 
                    majors.results.find((majorItem) => `${majorItem.id}` == id).text || "-unknown-"
                );
            if (data.techExperience && Array.isArray(data.techExperience))
                data.techExperienceNames = data.techExperience.map(id => 
                    tech.results.find((techItem) => `${techItem.id}` == id).text || "-unknown-"
                );
            result.push(data);
        }
    });

    return result;
}

module.exports = {
    getApplicationForUser,
    createApplicationForUser,
    updateApplicationForUser,
    setStatusOfApplication,
    getApplicationsPreview
}