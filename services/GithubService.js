const fetch = require('node-fetch');

/**
 * Function that returns the link for a github user
 * @param {string} username Github handle
 */
const getUserDataLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://api.github.com/users/${username}`;
};

/**
 * Function that returns the data for a github user
 * @param {string} username Github handle
 */
const getUserData = async (username) => {
    const url = getUserDataLink(username);
    const result = await fetch(url);
    return result.json();
};

/**
 * Function that returns the link for a user's repositories
 * @param {string} username Github handle
 */
const getUserReposLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://api.github.com/users/${username}/repos`;
};

/**
 * Function that returns an array with a user's repositories
 * @param {string} username Github handle
 */
const getUserRepos = async (username) => {
    const url = getUserReposLink(username);
    const result = await fetch(url);
    return result.json();
};

// export the functions
module.exports = {
    getUserData,
    getUserRepos
};
