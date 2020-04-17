const Recipe = require("../models/Recipe");
const RecipeFile = require("../models/RecipeFile");
const RecipeService = require("../services/RecipeService");
const Chef = require("../models/Chef");
const ChefService = require("../services/ChefService");

module.exports = {
  async index(req, res) {
    try {
      const allRecipes = await RecipeService.load("recipes");
      const recipes = allRecipes.filter((recipe, index) =>
        index > 5 ? false : true
      );

      return res.render("site/index", { recipes });
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
        offset,
        admin: true,
        userId: null,
      };

      let recipes = await Recipe.paginate(params);
      if (recipes[0] == undefined) {
        return res.render("site/recipes", {
          filter,
        });
      }

      const recipesPromise = recipes.map(async (recipe) => {
        const files = await RecipeFile.files(recipe.id);
        if (files[0]) recipe.img = files[0].path.replace("public", "");
      });

      await Promise.all(recipesPromise);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
        filter,
      };

      return res.render("site/recipes", {
        recipes,
        pagination,
        filter,
      });
    } catch (err) {
      console.error(err);
    }
  },
  async recipe(req, res) {
    try {
      const recipe = await RecipeService.load("recipe", req.params.id);
      if (!recipe) return res.send("Receita não encontrada");

      return res.render("site/recipe", { recipe });
    } catch (err) {
      console.error(err);
    }
  },
  async chefs(req, res) {
    try {
      const chefs = await ChefService.load("chefs");

      return res.render("site/chefs", { chefs });
    } catch (err) {
      console.log(err);
    }
  },
  async chef(req, res) {
    try {
      let chef = await ChefService.load("chef", req.params.id);
      if (!chef) return res.send("Chef não encontrado");

      let image = await Chef.files(chef.id);
      if (image[0]) image.src = image[0].path.replace("public", "");

      const recipes = await ChefService.load("recipes");

      return res.render("site/chef", {
        chef,
        image,
        recipes,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
