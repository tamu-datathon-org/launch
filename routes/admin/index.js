const express = require("express");
const router = express.Router();

const applicationService = require('./../../services/ApplicationService');

/**
 * Render the "admin" page for organizers and sponsors
 * Route: /apply/admin
 */
router.get("/", (req, res) => {
    return res.render("admin");
});


router.get("/deadline", async (req, res) => {
    const deadline = await applicationService.getCurrentDeadline();
    return res.send(deadline);
});

router.post("/deadline", async (req, res) => {
    const newDeadline = req.body.deadline;

    await applicationService.setCurrentDeadline(newDeadline);
    return res.send(newDeadline);
});

module.exports = router;
