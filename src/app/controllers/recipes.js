const Recipe = require("../models/Recipe");
const File = require("../models/File");
const RecipeFile = require("../models/RecipeFile");

module.exports = {
  async index(req, res) {
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

    const pagination = {
      total: Math.ceil(recipes[0].total / limit),
      page
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

    return res.render("admin/recipes/index", {
      recipes: recipesPromise,
      pagination
    });
  },
  async create(req, res) {
    const options = await Recipe.chefName();
    const chefs = options.rows;
    return res.render("admin/recipes/create", { chefs });
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "information") {
        return res.send("Por favor preencha todos os campos");
      }
    }

    if (req.files.length == 0)
      return res.send("Por favor envie ao menos uma imagem");

    req.body.user_id = req.session.userId;
    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(file => File.create({ ...file }));
    const filesId = await Promise.all(filesPromise);

    const relationPromise = filesId.map(fileId =>
      RecipeFile.create({
        recipe_id: recipeId,
        file_id: fileId
      })
    );

    await Promise.all(relationPromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    const recipe = results.rows[0];

    if (!recipe) return res.send("Receita não encontrada");

    results = await Recipe.files(recipe.id);
    const images = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("admin/recipes/show", { recipe, images });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    if (!recipe) return res.send("Receita não encontrada");

    const options = await Recipe.chefName();
    const chefs = options.rows;

    results = await Recipe.files(recipe.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("admin/recipes/edit", { recipe, chefs, files });
  },
  async put(req, res) {
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

    await Recipe.update(req.body);
    return res.redirect(`/admin/recipes/${req.body.id}`);
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
