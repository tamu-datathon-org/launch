const express = require("express");
const router = express.Router();
const { StatusCodes } = require("http-status-codes");
const ResumeService = require("../../services/ResumeService");

/**
 * Redirect to users resume PDF
 * Route: /apply/resume/<resumeId>
 */
router.get("/:resumeId", async (req, res) => {
    const user = req.user;
    const resumeId = req.params.resumeId || "";

    // check if the user should be able to access the resume
    // admins can check any resume, normal users can only see their own resume
    if (resumeId !== user.authId && !user.isAdmin) {
        return res.status(StatusCodes.UNAUTHORIZED).send();
    }

    try {
        // generate the signed url which grants temporary read access to resume
        const resumeUrl = await ResumeService.getSignedURLForResume(resumeId, "getObject");   
        return res.redirect(resumeUrl);
    } catch (e) {
        console.error(e);
        return res.status(StatusCodes.FORBIDDEN).send("Error returning resume");
    }
})


module.exports = router;