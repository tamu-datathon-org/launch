/**
 * Function that returns the link for top languages from username
 * @param {string} username Github handle
 */
const getTopLanguagesLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}`;
};

/**
 * Function that returns DATA for top languages (HTML)
 * @param {string} username Github handle
 */
const getTopLanguagesData = async (username) => {
    const dataURL = getTopLanguagesLink(username);

    const result = await fetch(dataURL);

    if (result) {
        return result;
    } else {
        throw new Error('Invalid data response - fetching top languages data');
    }
};

/**
 * Function that returns link for stats information for repositories
 * @param {string} username Github handle
 */
const getStatsCardLink = (username) => {
    if (!username) {
        throw new Error('"username" is not defined even though it should be');
    }

    return `https://github-readme-stats.vercel.app/api/top-langs/?username=${username}`;
};

/**
 * Function that returns DATA for top languages (HTML)
 * @param {string} username Github handle
 */
const getStatsCardData = async (username) => {
    const dataURL = getStatsCardLink(username);

    const result = await fetch(dataURL);

    if (result) {
        return result;
    } else {
        throw new Error('Invalid data response - fetching Stats data');
    }
};

// export the functions
module.exports = {
    getTopLanguagesLink,
    getTopLanguagesData,
    getStatsCardLink,
    getStatsCardData
};
