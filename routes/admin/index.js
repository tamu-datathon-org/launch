const express = require("express");
const router = express.Router();

/**
 * Render the "admin" page for organizers and sponsors
 * Route: /apply/admin
 */
router.get("/", (req, res) => {
    return res.render("admin");
});

module.exports = router;
