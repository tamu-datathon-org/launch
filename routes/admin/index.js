const express = require("express");
const router = express.Router();

const applicationService = require('./../../services/ApplicationService');

/**
 * Render the "admin" page for organizers and sponsors
 * Route: /apply/admin
 */
router.get("/", async (req, res) => {
    const data = await applicationService.getApplicationsPreview();
    return res.render("admin", { data });
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

/**
 * Render a json preview of the first 10 applications
 * Route: /apply/preview
 * Used for table view
 */
// router.get('/preview', async(req, res) => {
//     const data = await applicationService.getApplicationsPreview();
//     res.send(data);
// });

module.exports = router;
