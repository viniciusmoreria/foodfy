const express = require("express");
const routes = express.Router();
const home = require("./home");
const recipes = require("./recipes");
const chefs = require("./chefs");
const users = require("./users");

// Home
routes.use("/", home);

// Admin
routes.use("/admin", users);
routes.use("/admin", chefs);
routes.use("/admin", recipes);

module.exports = routes;
