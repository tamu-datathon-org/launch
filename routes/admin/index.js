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
