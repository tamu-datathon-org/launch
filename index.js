const express = require("express");
const cookieParser = require('cookie-parser');


// load environment varibles from .env file
const dotenv = require("dotenv");
const { checkIfLoggedIn } = require('./middleware/auth-check');
dotenv.config();

/**
 * Get Environment Variables
 */
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const basePath = process.env.BASE_PATH || "";
const admin = require('firebase-admin');

// Initialize fireabse (only has to be done once in the main js file)
// https://firebase.google.com/docs/admin/setup/
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // use default GOOGLE_APPLICATION_CREDENTIAL
    databaseURL: "https://project-f271e.firebaseio.com/"
});

/**
 * Import all routes
 */
const rootRoutes = require("./routes/index");
const helloRoutes = require("./routes/hello/index");

/**
 * Create Express server.
 */
const app = express();

/**
 * Setup middleware
 */
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Setup the routes
 */
app.use(`${basePath}/hello`, checkIfLoggedIn(), helloRoutes);
app.use(`${basePath}/`, checkIfLoggedIn(), rootRoutes);
app.use(`${basePath}`,express.static("public"));

app.listen(port, () => {
    console.log(`Website now availble on http://localhost:${port}/`);
});
