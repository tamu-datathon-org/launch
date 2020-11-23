const { S3 } = require('aws-sdk');

const s3 = new S3({
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.LAUNCH_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.LAUNCH_AWS_SECRET_ACCESS_KEY || "",
    },
});


/**
 * Returns a signed url for a Resume object for the browser client to be able to upload resume
 * @param {string} resumeId ID of resume AWS S3 Object
 * @param {"getObject" | "putObject"} type Operation URL should be able to do
 */
const getSignedURLForResume = (
    resumeId,
    type="getObject"
) =>
    s3.getSignedUrlPromise(type, {
        Bucket: "td-launch-resumes-2021",
        Key: `${resumeId}.pdf`,
        Expires: 600,
        ...(type === "getObject"
            ? {}
            : { ContentType: "application/pdf" }),
    });

module.exports = {
    getSignedURLForResume
}