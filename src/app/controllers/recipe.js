const fs = require("fs");
const data = require("../../../data.json");

module.exports = {
  // Logged-out routes
  home(req, res) {
    return res.render("index", { recipes: data.recipes });
  },
  about(req, res) {
    return res.render("about");
  },
  recipes(req, res) {
    return res.render("recipes", { recipes: data.recipes });
  },
  recipe(req, res) {
    const { id } = req.params;

    const foundRecipe = data.recipes.find(function(recipe) {
      return id == recipe.id;
    });

    if (!foundRecipe) return res.send("Recipe not found!");

    return res.render("recipe", { recipe: foundRecipe });
  },

  // Logged-in routes
  index(req, res) {
    return res.render("admin/index", { recipes: data.recipes });
  },
  create(req, res) {
    return res.render("admin/create");
  },
  show(req, res) {
    const { id } = req.params;

    const foundRecipe = data.recipes.find(function(recipe) {
      return id == recipe.id;
    });

    if (!foundRecipe) return res.send("Recipe not found!");

    return res.render("admin/show", { recipe: foundRecipe });
  },
  edit(req, res) {
    const { id } = req.params;

    const foundRecipe = data.recipes.find(function(recipe) {
      return id == recipe.id;
    });

    if (!foundRecipe) return res.send("Recipe not found!");

    return res.render("admin/edit", { recipe: foundRecipe });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    let {
      title,
      image,
      chef,
      ingredients,
      preparation,
      information
    } = req.body;

    const id = Number(data.recipes.length + 1);

    data.recipes.push({
      id,
      title,
      image,
      chef,
      ingredients,
      preparation,
      information
    });

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
      if (err) return res.send("Write file error!");

      return res.redirect(`/admin/recipe/${id}`);
    });
  },
  put(req, res) {
    const { id } = req.body;
    let index = 0;

    const foundRecipe = data.recipes.find(function(recipe, foundIndex) {
      if (id == recipe.id) {
        index = foundIndex;
        return true;
      }
    });

    if (!foundRecipe) return res.send("Recipe not found!");

    const recipe = {
      ...foundRecipe,
      ...req.body
    };

    data.recipes[index] = recipe;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
      if (err) return res.send("Write file error!");

      return res.redirect(`/admin/recipe/${id}`);
    });
  },
  delete(req, res) {
    const { id } = req.body;

    const filteredRecipes = data.recipes.filter(function(recipe) {
      return recipe.id != id;
    });

    data.recipes = filteredRecipes;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
      if (err) return res.send("Write file error!");

      return res.redirect("/admin");
    });
  }
};
