const Recipe = require("../models/Recipe");
const File = require("../models/File");
const RecipeFile = require("../models/RecipeFile");

module.exports = {
  async index(req, res) {
    try {
      let { page, limit } = req.query;
      page = page || 1;
      limit = limit || 6;
      let offset = limit * (page - 1);

      const params = {
        page,
        limit,
        offset
      };

      let results = await Recipe.paginate(params);
      const recipes = results.rows;

      if (recipes[0] == undefined) {
        return res.render("admin/recipes/index");
      }

      const recipesPromise = recipes.map(async recipe => {
        const files = await RecipeFile.files(recipe.id);
        if (files[0]) recipe.img = files[0].path.replace("public", "");
      });

      await Promise.all(recipesPromise);

      const pagination = {
        total: Math.ceil(recipes[0].total / limit),
        page
      };

      return res.render("admin/recipes/index", {
        recipes,
        pagination
      });
    } catch (err) {
      console.error(err);
    }
  },
  async create(req, res) {
    try {
      const options = await Recipe.chefName();
      const chefs = options.rows;
      return res.render("admin/recipes/create", { chefs });
    } catch (err) {
      console.error(err);
    }
  },
  async post(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (req.body[key] == "" && key != "information") {
          return res.send("Por favor preencha todos os campos");
        }
      }

      if (req.files.length == 0)
        return res.send("Por favor envie ao menos uma imagem");

      let { chef, title, ingredients, preparation, information } = req.body;

      const recipeId = await Recipe.create({
        chef_id: chef,
        user_id: req.session.userId,
        title,
        ingredients,
        preparation,
        information
      });

      const filesPromise = req.files.map(file =>
        File.create({ name: file.filename, path: file.path })
      );
      const filesId = await Promise.all(filesPromise);

      const relationPromise = filesId.map(fileId =>
        RecipeFile.create({
          recipe_id: recipeId,
          file_id: fileId
        })
      );

      await Promise.all(relationPromise);

      return res.redirect(`/admin/recipes/${recipeId}`);
    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      let recipe = await Recipe.find(req.params.id);
      if (!recipe) return res.send("Receita não encontrada");

      let images = await Recipe.files(recipe.id);
      images = images.map(file => ({
        ...file,
        src: images[0].path.replace("public", "")
      }));

      return res.render("admin/recipes/show", { recipe, images });
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      let recipe = await Recipe.find(req.params.id);

      if (!recipe) return res.send("Receita não encontrada");

      const options = await Recipe.chefName();
      const chefs = options.rows;

      let images = await Recipe.files(recipe.id);
      images = images.map(file => ({
        ...file,
        src: images[0].path.replace("public", "")
      }));

      return res.render("admin/recipes/edit", { recipe, chefs, images });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      const keys = Object.keys(req.body);

      for (key of keys) {
        if (
          req.body[key] == "" &&
          key != "removed_files" &&
          key != "information"
        ) {
          return res.send("Por favor preencha todos os campos!");
        }
      }

      if (req.files.length != 0) {
        const newFilesPromise = req.files.map(file => File.create(file));
        const filesId = await Promise.all(newFilesPromise);

        const relationPromise = filesId.map(fileId =>
          RecipeFile.create({
            recipe_id: req.body.id,
            file_id: fileId
          })
        );

        await Promise.all(relationPromise);
      }

      if (req.body.removed_files) {
        const removedFiles = req.body.removed_files.split(",");
        const lastIndex = removedFiles.length - 1;
        removedFiles.splice(lastIndex, 1);

        const removedFilesPromise = removedFiles.map(id => File.delete(id));

        await Promise.all(removedFilesPromise);
      }

      await Recipe.update(req.body.id, {
        chef_id: chef,
        title,
        ingredients,
        preparation,
        information
      });

      return res.redirect(`/admin/recipes/${req.body.id}`);
    } catch (err) {
      console.error(err);
    }
  },
  async delete(req, res) {
    try {
      let results = await Recipe.files(req.body.id);
      files = results.rows[0].id;
      await File.delete(files);
      await Recipe.delete(req.body.id);

      return res.redirect("/admin/recipes");
    } catch (err) {
      console.error(err);
    }
  }
};
