const express = require("express");
const routes = express.Router();
const home = require("./home");
const recipes = require("./recipes");
const chefs = require("./chefs");
const users = require("./users");

// Home
routes.use("/", home);

// Admin
routes.use("/admin", recipes);
routes.use("/admin", chefs);

// Users
routes.use("/users", users);

// Alias
routes.get("/accounts", function(req, res) {
  return res.redirect("users/register");
});

routes.get("/admin", function(req, res) {
  return res.redirect("admin/recipes");
});

module.exports = routes;
