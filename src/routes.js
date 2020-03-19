const express = require("express");
const routes = express.Router();
const multer = require("./app/middlewares/multer");
const recipe = require("./app/controllers/recipes");
const chef = require("./app/controllers/chefs");
const site = require("./app/controllers/site");

// Site routes
routes.get("/", site.index);
routes.get("/about", site.about);
routes.get("/recipes", site.recipes);
routes.get("/recipes/:id", site.recipe);
routes.get("/chefs", site.chefs);
routes.get("/chefs/:id", site.chef);

// Admin Recipes routes
routes.get("/admin", function(req, res) {
  return res.redirect("admin/recipes");
});
routes.get("/admin/recipes", recipe.index);
routes.get("/admin/recipes/create", recipe.create);
routes.get("/admin/recipes/:id", recipe.show);
routes.get("/admin/recipes/:id/edit", recipe.edit);
routes.post("/admin/recipes", multer.array("images", 5), recipe.post);
routes.put("/admin/recipes", multer.array("images", 5), recipe.put);
routes.delete("/admin/recipes", recipe.delete);

//Admin Chefs routes
routes.get("/admin/chefs", chef.index);
routes.get("/admin/chefs/create", chef.create);
routes.get("/admin/chefs/:id", chef.show);
routes.get("/admin/chefs/:id/edit", chef.edit);
routes.post("/admin/chefs", multer.array("images", 1), chef.post);
routes.put("/admin/chefs", multer.array("images", 1), chef.put);
routes.delete("/admin/chefs", chef.delete);

module.exports = routes;
