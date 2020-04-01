const Recipe = require("../models/Recipe");
const RecipeFile = require("../models/RecipeFile");
const Chef = require("../models/Chef");

module.exports = {
  async index(req, res) {
    try {
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

      const recipesPromise = recipes.map(async recipe => {
        const files = await RecipeFile.files(recipe.id);
        if (files[0]) recipe.img = files[0].path.replace("public", "");
      });

      await Promise.all(recipesPromise);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
        filter
      };

      return res.render("site/index", { recipes, pagination });
    } catch (err) {
      console.error(err);
    }
  },
  about(req, res) {
    return res.render("site/about");
  },
  async recipes(req, res) {
    try {
      let { filter, page, limit } = req.query;
      page = page || 1;
      limit = limit || 9;
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
        return res.render("site/recipes", {
          filter
        });
      }

      const recipesPromise = recipes.map(async recipe => {
        const files = await RecipeFile.files(recipe.id);
        if (files[0]) recipe.img = files[0].path.replace("public", "");
      });

      await Promise.all(recipesPromise);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
        filter
      };

      return res.render("site/recipes", {
        recipes,
        pagination,
        filter
      });
    } catch (err) {
      console.error(err);
    }
  },
  async recipe(req, res) {
    try {
      let recipe = await Recipe.find(req.params.id);
      if (!recipe) return res.send("Receita não encontrada");

      let images = await Recipe.files(recipe.id);
      images = images.map(file => ({
        ...file,
        src: images[0].path.replace("public", "")
      }));

      return res.render("site/recipe", { recipe, images });
    } catch (err) {
      console.error(err);
    }
  },
  async chefs(req, res) {
    let chefs = await Chef.all(req.body);

    const filesPromise = chefs.map(async chef => {
      const files = await Chef.files(chef.id);
      if (files[0]) chef.img = files[0].path.replace("public", "");
    });

    await Promise.all(filesPromise);

    return res.render("site/chefs", { chefs });
  },
  async chef(req, res) {
    let chef = await Chef.find(req.params.id);
    if (!chef) return res.send("Chef não encontrado");

    let image = await Chef.files(chef.id);
    if (image[0]) image.src = image[0].path.replace("public", "");

    const recipes = await Chef.recipes();

    const itemsPromise = recipes.map(async recipe => {
      const files = await Recipe.files(recipe.id);
      if (files[0]) recipe.src = files[0].path.replace("public", "");
    });

    await Promise.all(itemsPromise);

    return res.render("site/chef", {
      chef,
      image,
      recipes
    });
  }
};
