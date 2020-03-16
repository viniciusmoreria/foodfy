const Recipe = require("../models/Recipe");

module.exports = {
  // Logged-in routes
  async index(req, res) {
    let { filter, page, limit } = req.query;
    page = page || 1;
    limit = limit || 6;
    let offset = limit * (page - 1);

    const params = {
      filter,
      page,
      limit,
      offset
    };

    let results = await Recipe.paginate(params);
    const recipes = results.rows;

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page,
      filter
    };

    return res.render("admin/recipes/index", { recipes, pagination });
  },
  async create(req, res) {
    const options = await Recipe.chefName();
    const chefs = options.rows;
    return res.render("admin/recipes/create", { chefs });
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
