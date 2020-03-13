const express = require("express");
const routes = express.Router();
const recipe = require("./app/controllers/recipe");

// Logged-out routes
routes.get("/", recipe.home);
routes.get("/about", recipe.about);
routes.get("/recipes", recipe.recipes);
routes.get("/recipe/:id", recipe.recipe);

// Logged-in routes
routes.get("/admin/", recipe.index);
routes.get("/admin/create", recipe.create);
routes.get("/admin/recipe/:id", recipe.show);
routes.get("/admin/:id/edit", recipe.edit);
routes.post("/admin", recipe.post);
routes.put("/admin", recipe.put);
routes.delete("/admin", recipe.delete);

module.exports = routes;
