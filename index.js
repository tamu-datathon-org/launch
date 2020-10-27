const express = require("express");

// load environment varibles from .env file
const dotenv = require("dotenv");
dotenv.config();

/**
 * Get Environment Variables
 */
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const basePath = process.env.BASE_PATH || "";

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
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Setup the routes
 */
app.use(`${basePath}/hello`, helloRoutes);
app.use(`${basePath}/`, rootRoutes);

app.listen(port, () => {
    console.log(`Website now availble on http://localhost:${port}/`);
});
