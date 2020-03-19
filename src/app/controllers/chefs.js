const Chef = require("../models/Chef");
const File = require("../models/File");
const Recipe = require("../models/Recipe");

module.exports = {
  // Logged-in routes
  async index(req, res) {
    let results = await Chef.all(req.body);
    const chefs = results.rows;

    return res.render("admin/chefs/index", { chefs });
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
    let results = await Chef.find(req.params.id);
    let chef = results.rows[0];
    let recipes = results.rows;

    if (!chef) return res.send("Chef não encontrado");

    results = await Chef.files(chef.id);
    const images = results.rows.map(file => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`
    }));

    return res.render("admin/chefs/show", { chef, images, recipes });
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
    await Chef.delete(req.body.id);

    return res.redirect("/admin/chefs");
  }
};
