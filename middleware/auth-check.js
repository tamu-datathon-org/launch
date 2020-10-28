const fetch = require('node-fetch');
const { StatusCodes } = require("http-status-codes");

const gatekeeperUrl = process.env.GATEKEEPER_URL || "https://tamudatathon.com/auth";

/**
 * Gatekeeper Authentication middleware generator
 * @param {boolean?} onlyAllowIfAdminstrator If true, middleware will only let request through if logged in user isAdmin
 */
const checkIfLoggedIn = (onlyAllowIfAdminstrator) => async (req, res, next) => {
    const token = req.cookies.accessToken || "";
    const redirectUrl = `${req.baseUrl}${req.path}`;
    const user = req.user;

    // check if the auth middleware has already happened in this request before
    // if the user exists and the request allows for non-admins, let the request through
    if (user && !onlyAllowIfAdminstrator) {
        return next();
    } else if (user && onlyAllowIfAdminstrator && user.isAdmin) {
        // if the user exists and is an admin and its an admin route, let them through
        return next();
    }

    // if there is now auth token cookie then they are definetely not logged in
    if (!token) 
        return res.redirect(`/auth/login?r=${redirectUrl}`); 

    // there is an auth token cookie, ask gatekeeper if it is valid
    const authRes = await fetch(`${gatekeeperUrl}/user`, {
        headers: {
            Cookie: `accessToken=${token}`,
            Accept: "application/json"
        }
    });

    // if gatekeeper says user token is invalid send to login page
    if (authRes.status != StatusCodes.OK)
        return res.redirect(`/auth/login?r=${redirectUrl}`); 
    
    const json = await authRes.json();
    
    // if this is configured to only let admins through and user isn't admin, return unauthorized response
    if (onlyAllowIfAdminstrator && !json["isAdmin"])
        return res.status(StatusCodes.UNAUTHORIZED).send();
    
    req.user = json;
    return next();
}

module.exports = {
    checkIfLoggedIn
}