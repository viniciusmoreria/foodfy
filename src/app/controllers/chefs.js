const Chef = require("../models/Chef");
const File = require("../models/File");
const Recipe = require("../models/Recipe");

module.exports = {
  async index(req, res) {
    try {
      let chefs = await Chef.all(req.body);

      const filesPromise = chefs.map(async chef => {
        const files = await Chef.files(chef.id);
        if (files[0]) chef.img = files[0].path.replace("public", "");
      });

      await Promise.all(filesPromise);

      return res.render("admin/chefs/index", { chefs });
    } catch (err) {
      console.error(err);
    }
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Por favor preencha todos os campos");
      }
    }

    if (req.files.length == 0)
      return res.send("Por favor envie ao menos uma imagem");

    let results = await File.create(req.files[0]);

    const chef = {
      ...req.body,
      fileId: results
    };

    await Chef.create(chef);

    return res.redirect(`/admin/chefs`);
  },
  async show(req, res) {
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

    return res.render("admin/chefs/show", { chef, image, recipes });
  },
  async edit(req, res) {
    let results = await Chef.find(req.params.id);

    let chef = results.rows[0];

    results = await Chef.files(chef.id);
    let files = results.rows;
    files = files.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("admin/chefs/edit", { chef, files });
  },
  async put(req, res) {
    const keys = Object.keys(req.body);
    for (let key of keys) {
      if (req.body[key] == "" && key !== "removed_files") {
        return res.send("Por favor preencha todos os campos");
      }
    }

    if (req.files.length != 0) {
      let results = await File.create(req.files[0]);
      let chefs = {
        ...req.body,
        fileId: results
      };
      await Chef.update(chefs);
    } else {
      let results = await Chef.find(req.body.id);
      let item = results.rows[0];
      results = await Chef.files(item.id);

      let chef = {
        ...req.body,
        fileId: results.rows[0].file_id
      };
      await Chef.update(chef);
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");

      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);
      File.delete(removedFiles[0]);
    }
    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    try {
      let results = await Chef.files(req.body.id);
      files = results.rows[0].id;
      await File.delete(files);
      await Chef.delete(req.body.id);

      return res.redirect("/admin/chefs");
    } catch (err) {
      console.error(err);
    }
  }
};
