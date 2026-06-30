require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });

const app = require("../app");
const connectDB = require("../config/db");

connectDB();

module.exports = app;