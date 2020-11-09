const admin = require('firebase-admin');

/**
 * Gets the appication for a specified user.
 * Returns undefined if there is no application
 * @param {string} userId User Auth ID
 */
const getApplicationForUser = async (userId) => {
    const doc = await admin.firestore().collection("applications").doc(userId).get();
    const data = doc.data();
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

module.exports = {
    getApplicationForUser,
    createApplicationForUser,
    updateApplicationForUser,
    setStatusOfApplication
}