const express = require("express");
const router = express.Router();
const applicationService = require('../services/ApplicationService');
const majors = require('../public/college-majors.json');
const colleges = require('../public/colleges.json');
const technologies = require('../public/technologies.json')
const ResumeService = require("../services/ResumeService");

/**
 * Serve home page
 * Route: /apply/
 */
router.get("/", async (req, res) => {
    const user = req.user;
    const currentApplication = await applicationService.getApplicationForUser(user.authId);

    const resumeWriteUrl = await ResumeService.getSignedURLForResume(user.authId, "putObject");

    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        majors,
        colleges,
        technologies,
        justSubmitted: false,
        resumeWriteUrl: resumeWriteUrl || "",
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userAuthId: user.authId,
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

    // make sure majors and minor is an array
    if (req.body.majors && !Array.isArray(req.body.majors)) {
        req.body.majors = [req.body.majors]
    }
    if (req.body.minors && !Array.isArray(req.body.minors)) {
        req.body.minors = [req.body.minors]
    }

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
    
    const resumeWriteUrl = await ResumeService.getSignedURLForResume(user.authId, "putObject");

    // render page
    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        justSubmitted: true,
        majors,
        colleges,
        technologies,
        resumeWriteUrl: resumeWriteUrl || "",
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userAuthId: user.authId,
            ...currentApplication
        }
    });
});

router.get("/app/:id", async(req, res) => {
    const userId = req.params.id;
    const lastApp =  await applicationService.getApplicationForUser(userId);
    res.send(lastApp);
});

module.exports = router;
