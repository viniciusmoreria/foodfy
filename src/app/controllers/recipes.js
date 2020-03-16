const Recipe = require("../models/Recipe");

module.exports = {
  // Logged-out routes
  async home(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;

    return res.render("index", { recipes });
  },
  about(req, res) {
    return res.render("about");
  },
  async recipes(req, res) {
    const { filter } = req.query;

    if (filter) {
      let results = await Recipe.findBy(filter);
      const recipes = results.rows;

      return res.render("recipes", { recipes, filter });
    } else {
      let results = await Recipe.all();

      const recipes = results.rows;
      return res.render("recipes", { recipes });
    }
  },
  async recipe(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    return res.render("show-recipe", { recipe });
  },

  // Logged-in routes
  async index(req, res) {
    let results = await Recipe.all();
    const recipes = results.rows;

    return res.render("admin/recipes/index", { recipes });
  },
  create(req, res) {
    Recipe.chefName(function(options) {
      return res.render("admin/recipes/create", { chefs: options });
    });
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    return res.render("admin/recipes/show", { recipe });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    const options = await Recipe.chefName();
    const chefs = options.rows;

    return res.render("admin/recipes/edit", { recipe, chefs });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    await Recipe.create(req.body);

    return res.redirect(`/admin/recipes/${recipe.id}`);
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
  },
  async delete(req, res) {
    await Recipe.delete(req.body.id);
    return res.redirect("/admin");
  }
};
