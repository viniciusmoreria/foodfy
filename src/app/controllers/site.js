const Recipe = require("../models/Recipe");
const Chef = require("../models/Chef");

module.exports = {
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

    if (recipes[0] == undefined) {
      return res.render("site/index");
    }

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page,
      filter
    };

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const images = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      );

      return images[0];
    }

    const filesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    const recipesPromise = await Promise.all(filesPromise);

    return res.render("site/index", { recipes: recipesPromise, pagination });
  },
  about(req, res) {
    return res.render("site/about");
  },
  async recipes(req, res) {
    let { filter } = req.query;

    const params = {
      filter
    };

    let results = await Recipe.paginate(params);
    const recipes = results.rows;

    async function getImage(recipeId) {
      let results = await Recipe.files(recipeId);
      const images = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      );

      return images[0];
    }

    const filesPromise = recipes.map(async recipe => {
      recipe.img = await getImage(recipe.id);
      return recipe;
    });

    const recipesPromise = await Promise.all(filesPromise);

    if (recipes[0] == undefined) {
      return res.render("site/recipes", { recipes, filter });
    }

    return res.render("site/recipes", { recipes: recipesPromise, filter });
  },
  async recipe(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    if (!recipe) return res.send("Receita não encontrada");

    results = await Recipe.files(recipe.id);
    const images = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("site/recipe", { recipe, images });
  },
  async chefs(req, res) {
    let results = await Chef.all(req.body);
    const chefs = results.rows;

    async function getImage(chefId) {
      let results = await Chef.files(chefId);
      const images = results.rows.map(
        file =>
          `${req.protocol}://${req.headers.host}${file.path.replace(
            "public",
            ""
          )}`
      );
      return images[0];
    }

    const filesPromise = chefs.map(async chef => {
      chef.img = await getImage(chef.id);
      return chef;
    });

    const chefsPromise = await Promise.all(filesPromise);

    return res.render("site/chefs", { chefs: chefsPromise });
  },
  async chef(req, res) {
    let results = await Chef.find(req.params.id);
    let chef = results.rows[0];

    if (!chef) return res.send("Chef não encontrado");

    profile = await Chef.files(chef.id);
    let image = profile.rows[0].path;
    image = {
      ...chef,
      src: image.replace("public", "")
    };

    const files = await Chef.recipes();
    const recipes = files.rows;

    const itemsPromise = recipes.map(async recipe => {
      const files = await Recipe.files(recipe.id);
      recipe.src = files.rows[0].path.replace("public", "");
    });

    await Promise.all(itemsPromise);

    return res.render("site/chef", {
      chef,
      image,
      recipes
    });
  }
};
