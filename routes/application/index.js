const express = require("express");
const router = express.Router();
const applicationService = require('../../services/ApplicationService');

/**
 * Return application details as JSON
 * Route: /apply/application/<id>
 */
router.get("/:id", async(req, res) => {
    const userId = req.params.id;
    const lastApp =  await applicationService.getApplicationForUser(userId);
    return res.json(lastApp);
});

module.exports = router;
