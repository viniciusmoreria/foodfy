const express = require("express");
const routes = express.Router();
const site = require("../app/controllers/site");

routes.get("/", site.index);
routes.get("/about", site.about);
routes.get("/recipes", site.recipes);
routes.get("/recipes/:id", site.recipe);
routes.get("/chefs", site.chefs);
routes.get("/chefs/:id", site.chef);

module.exports = routes;
