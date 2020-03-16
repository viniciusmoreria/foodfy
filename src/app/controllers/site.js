const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
  // Logged-out routes
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

    return res.render("site/index", { recipes, pagination });
  },
  about(req, res) {
    return res.render("site/about");
  },
  async recipes(req, res) {
    const { filter } = req.query;

    if (filter) {
      let results = await Recipe.findBy(filter);
      const recipes = results.rows;

      return res.render("site/recipes", { recipes, filter });
    } else {
      let results = await Recipe.all();

      const recipes = results.rows;
      return res.render("site/recipes", { recipes });
    }
  },
  async recipe(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    return res.render("site/recipe", { recipe });
  },
  async chefs(req, res) {
    let results = await Chef.all(req.body);
    const chefs = results.rows;

    return res.render("site/chefs", { chefs });
  },
  async chef(req, res) {
    let results = await Chef.find(req.params.id);

    let chef = results.rows[0];

    const recipes = results.rows;

    return res.render("site/chef", { chef, recipes });
  }
};
