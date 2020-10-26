/**
 * Function that returns the appropriate greeting given a name
 * @param {string} name Name to use
 */
const getHelloStringFromName = (name) => {
    if (!name) {
        throw new Error('"Name" is not defined even though it should be');
    }

    return `Hello ${name}! Welcome to this neato burrito application system!`;
};

// export the functions
module.exports = {
    getHelloStringFromName,
};
