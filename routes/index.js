const express = require("express");
const router = express.Router();
const applicationService = require('../services/ApplicationService');
const majors = require('../public/college-majors.json');

/**
 * Serve home page
 * Route: /apply/
 */
router.get("/", async (req, res) => {
    const user = req.user;
    const currentApplication = await applicationService.getApplicationForUser(user.authId);
    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        majors,
        justSubmitted: false,
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            ...currentApplication
        }
    });
});

/**
 * Handle when person submits application form
 * Route: POST /apply
 */
router.post("/", async (req, res) => {
    const user = req.user;

    // check if existing app exists
    const lastApp =  await applicationService.getApplicationForUser(user.authId);
    if (!lastApp) {
        // crreate app if it doesn't exist
        await applicationService.createApplicationForUser(user.authId, {
            ...req.body
        });
    } else {
        // otherwise update the application
        await applicationService.updateApplicationForUser(user.authId, {
            ...req.body
        })
    }

    // get new current application
    const currentApplication =  await applicationService.getApplicationForUser(user.authId);

    // render page
    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        justSubmitted: true,
        majors,
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            ...currentApplication
        }
    });
});

module.exports = router;
