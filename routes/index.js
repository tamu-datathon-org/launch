const express = require("express");
const router = express.Router();
const majors = require('../public/college-majors.json');
const colleges = require('../public/colleges.json');
const technologies = require('../public/technologies.json');
const ResumeService = require("../services/ResumeService");
const applicationService = require('../services/ApplicationService');

/**
 * Serve home page
 * Route: /apply/
 */
router.get("/", async (req, res) => {
    const user = req.user;
    const currentApplication = await applicationService.getApplicationForUser(user.authId);
    const currentDeadline = new Date(await applicationService.getCurrentDeadline());

    const resumeWriteUrl = await ResumeService.getSignedURLForResume(user.authId, "putObject");

    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        majors,
        colleges,
        technologies,
        justSubmitted: false,
        resumeWriteUrl: resumeWriteUrl || "",
        currentDeadline,
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
    if (req.body.techExperience && !Array.isArray(req.body.techExperience)) {
        req.body.techExperience = [req.body.techExperience]
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

    const currentDeadline = new Date(await applicationService.getCurrentDeadline());

    // render page
    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        justSubmitted: true,
        majors,
        colleges,
        technologies,
        resumeWriteUrl: resumeWriteUrl || "",
        currentDeadline,
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            userAuthId: user.authId,
            ...currentApplication
        }
    });
});

module.exports = router;
