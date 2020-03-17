const Recipe = require("../models/Recipe");
const File = require("../models/File");

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
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "" && key != "information") {
        return res.send("Please, fill all fields!");
      }
    }

    if (req.files.length == 0)
      return res.send("Please, send at least one image");

    let results = await Recipe.create(req.body);
    const recipeId = results.rows[0].id;

    const filesPromise = req.files.map(file =>
      File.create({
        ...file,
        recipe_id: recipeId
      })
    );
    await Promise.all(filesPromise);

    return res.redirect(`/admin/recipes/${recipeId}`);
  },
  async show(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    return res.render("admin/recipes/show", { recipe });
  },
  async edit(req, res) {
    let results = await Recipe.find(req.params.id);
    let recipe = results.rows[0];

    if (!recipe) return res.send("Recipe not found!");

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
        return res.send("Please, fill all fields!");
      }
    }

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file =>
        File.create({ ...file, recipe_id: req.body.id })
      );

      await Promise.all(newFilesPromise);
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
    await Recipe.delete(req.body.id);
    return res.redirect("/admin");
  }
};
