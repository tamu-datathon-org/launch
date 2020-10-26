const express = require("express");
const router = express.Router();

/**
 * Serve home page
 */
router.get("/", (req, res) => {
    return res.render("index");
});

module.exports = router;
