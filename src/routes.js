const express = require("express");
const routes = express.Router();
const recipe = require("./app/controllers/recipes");
const chef = require("./app/controllers/chefs");

// Logged-out routes
routes.get("/", recipe.home);
routes.get("/about", recipe.about);
routes.get("/recipes/:id", recipe.recipe);
routes.get("/recipes", recipe.recipes);

// Logged-in routes
routes.get("/admin/recipes", recipe.index);
routes.get("/admin/create", recipe.create);
routes.get("/admin/recipes/:id", recipe.show);
routes.get("/admin/recipes/:id/edit", recipe.edit);
routes.post("/admin/recipes", recipe.post);
routes.put("/admin/recipes", recipe.put);
routes.delete("/admin/recipes", recipe.delete);

//Chefs routes
routes.get("/chefs", chef.index);
routes.get("/chefs/:id", chef.chef);
routes.get("/admin/chefs", chef.indexAdmin);
routes.get("/admin/chefs/create", chef.create);
routes.get("/admin/chefs/:id", chef.show);
routes.get("/admin/chefs/:id/edit", chef.edit);
routes.post("/admin/chefs", chef.post);
routes.put("/admin/chefs", chef.put);
routes.delete("/admin/chefs", chef.delete);

module.exports = routes;
