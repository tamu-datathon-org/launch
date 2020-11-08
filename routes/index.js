const express = require("express");
const router = express.Router();
const applicationService = require('../services/ApplicationService');

/**
 * Serve home page
 */
router.get("/", async (req, res) => {
    const user = req.user;
    console.log(user);
    const currentApplication = await applicationService.getApplicationForUser(user.authId);
    return res.render("index", {
        applicationExists: currentApplication != undefined && currentApplication != null,
        currentApplication: { 
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            ...currentApplication
        }
    });
});

router.post("/", (req, res) => {
    req.body
    return res.render("index");
});

module.exports = router;
