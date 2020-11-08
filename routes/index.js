const express = require("express");
const router = express.Router();
const majors = require('../public/college-majors.json');

/**
 * Serve home page
 */
router.get("/", (req, res) => {
    return res.render("index", { majors });
});

module.exports = router;
