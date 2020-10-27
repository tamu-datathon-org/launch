const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const HelloService = require("../../services/HelloService");

/**
 * Redirect to "hello" page when someone fills out form on home page
 * Route: /hello
 */
router.post("/", (req, res) => {
    // get the name field from the body of the request
    const { name } = req.body;

    if (!name) {
        // if the name is not defined send an error saying the request is bad
        return res.status(StatusCodes.BAD_REQUEST).send();
    }

    // if the name is valid redirect the request to /hello/<name> so that the page will be rendered
    return res.redirect(`${process.env.BASE_PATH || ""}/hello/${encodeURIComponent(name)}`);
});

/**
 * Render the "hello" page which says "Hello <name>!"
 * Route: /hello/<name>
 */
router.get("/:name", (req, res) => {
    // get the name from the URL param (ex: /hello/george would make name = "george")
    const name = req.params.name;
    try {
        const greeting = HelloService.getHelloStringFromName(name);

        // render the view and pass the greeting along
        return res.render("hello", {
            greeting,
        });
    } catch (e) {
        // uh oh an error occurred from the service somehow

        // print the stacktrace of error
        console.error(e.stack);

        // send error response to browser
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
    }
});

module.exports = router;
