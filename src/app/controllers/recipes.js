const Recipe = require("../models/Recipe");

module.exports = {
  // Logged-out routes
  home(req, res) {
    Recipe.all(function(recipes, recipe) {
      return res.render("index", { recipes, recipe });
    });
  },
  about(req, res) {
    return res.render("about");
  },
  recipes(req, res) {
    Recipe.all(function(recipes, recipe) {
      return res.render("recipes", { recipes, recipe });
    });
  },
  recipe(req, res) {
    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!");

      return res.render("show-recipe", { recipe });
    });
  },

  // Logged-in routes
  index(req, res) {
    Recipe.all(function(recipes) {
      return res.render("admin/recipes/index", { recipes });
    });
  },
  create(req, res) {
    Recipe.chefName(function(options) {
      return res.render("admin/recipes/create", { chefs: options });
    });
  },
  show(req, res) {
    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!");

      return res.render("admin/recipes/show", { recipe });
    });
  },
  edit(req, res) {
    Recipe.find(req.params.id, function(recipe) {
      if (!recipe) return res.send("Recipe not found!");

      Recipe.chefName(function(options) {
        return res.render("admin/recipes/edit", { recipe, chefs: options });
      });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    Recipe.create(req.body, function(recipe) {
      return res.redirect(`/admin/recipes/${recipe.id}`);
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    Recipe.update(req.body, function() {
      return res.redirect(`/admin/recipes/${req.body.id}`);
    });
  },
  delete(req, res) {
    Recipe.delete(req.body.id, function() {
      return res.redirect("/admin");
    });
  }
};
