const File = require("../models/File");
const Recipe = require("../models/Recipe");
const RecipeFile = require("../models/RecipeFile");

const RecipeService = require("../services/RecipeService");
const DeleteService = require("../services/DeleteService");

module.exports = {
  async index(req, res) {
    try {
      let { page, limit } = req.query;
      page = page || 1;
      limit = limit || 6;
      let offset = limit * (page - 1);

      let { admin, userId } = req.session;
      if (!admin) admin = false;

      const params = {
        page,
        limit,
        offset,
        admin,
        userId,
      };

      let recipes = await Recipe.paginate(params);

      if (recipes[0] == undefined) {
        return res.render("admin/recipes/index");
      }

      const recipesPromise = recipes.map(async (recipe) => {
        const files = await RecipeFile.files(recipe.id);
        if (files[0]) recipe.img = files[0].path.replace("public", "");
      });

      await Promise.all(recipesPromise);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page,
      };

      return res.render("admin/recipes/index", {
        recipes,
        pagination,
      });
    } catch (err) {
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const chefs = await Recipe.chefName();

      return res.render("admin/recipes/create", { chefs });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      let { chef, title, ingredients, preparation, information } = req.body;

      const recipeId = await Recipe.create({
        chef_id: chef,
        user_id: req.session.userId,
        title,
        ingredients,
        preparation,
        information,
      });

      const filesPromise = req.files.map((file) =>
        File.create({ name: file.filename, path: file.path })
      );
      const filesId = await Promise.all(filesPromise);

      const relationPromise = filesId.map((fileId) =>
        RecipeFile.create({
          recipe_id: recipeId,
          file_id: fileId,
        })
      );

      await Promise.all(relationPromise);

      return res.render("admin/parts/success", {
        type: "Receita",
        action: "criada",
      });
    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      const recipe = await RecipeService.load("recipe", req.params.id);
      if (!recipe) return res.send("Receita não encontrada");

      return res.render("admin/recipes/show", { recipe });
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      const recipe = await RecipeService.load("recipe", req.params.id);
      if (!recipe) return res.send("Receita não encontrada");

      const chefs = await Recipe.chefName();

      return res.render("admin/recipes/edit", { recipe, chefs });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      let { chef, title, ingredients, preparation, information } = req.body;

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map((file) =>
          File.create({ name: file.filename, path: file.path })
        );
        const filesId = await Promise.all(newFilesPromise);

        const relationPromise = filesId.map((fileId) =>
          RecipeFile.create({
            recipe_id: req.body.id,
            file_id: fileId,
          })
        );

        await Promise.all(relationPromise);
      }

      if (req.body.removed_files) {
        DeleteService.removedFiles(req.body);
      }

      await Recipe.update(req.body.id, {
        chef_id: chef,
        title,
        ingredients,
        preparation,
        information,
      });

      return res.render("admin/parts/success", {
        type: "Receita",
        action: "atualizada",
      });
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      const files = await Recipe.files(req.body.id);

      await Recipe.delete(req.body.id);

      DeleteService.deleteFiles(files);

      return res.render("admin/parts/success", {
        type: "Receita",
        action: "deletada",
      });
    } catch (err) {
      console.error(err);
    }
  },
};
