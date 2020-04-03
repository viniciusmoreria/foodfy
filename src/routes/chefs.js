const express = require("express");
const routes = express.Router();
const multer = require("../app/middlewares/multer");
const chef = require("../app/controllers/chefs");

const { onlyAdmin, onlyUsers } = require("../app/middlewares/session");

const Validator = require("../app/validators/fields");

routes.get("/chefs", onlyUsers, chef.index);
routes.get("/chefs/create", onlyAdmin, chef.create);
routes.get("/chefs/:id", onlyUsers, chef.show);
routes.get("/chefs/:id/edit", onlyAdmin, chef.edit);
routes.post("/chefs", multer.array("images", 1), Validator.post, chef.post);
routes.put(
  "/chefs",
  multer.array("images", 1),
  onlyAdmin,
  Validator.put,
  chef.put
);
routes.delete("/chefs", onlyAdmin, chef.delete);

module.exports = routes;
