const express = require("express");
const routes = express.Router();
const multer = require("../app/middlewares/multer");
const recipe = require("../app/controllers/recipes");

const { onlyUsers } = require("../app/middlewares/session");

routes.get("/recipes", recipe.index);
routes.get("/recipes/create", onlyUsers, recipe.create);
routes.get("/recipes/:id", recipe.show);
routes.get("/recipes/:id/edit", recipe.edit);
routes.post("/recipes", multer.array("images", 5), recipe.post);
routes.put("/recipes", multer.array("images", 5), recipe.put);
routes.delete("/recipes", recipe.delete);

module.exports = routes;
