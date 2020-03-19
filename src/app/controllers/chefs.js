const Chef = require("../models/Chef");
const File = require("../models/File");

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
        return res.send("Please, fill all fields!");
      }
    }

    await Chef.create(req.body);

    return res.redirect(`/admin/chefs/${chef.id}`);
  },
  async show(req, res) {
    let results = await Chef.find(req.params.id);

    let chef = results.rows[0];

    const recipes = results.rows;

    return res.render("admin/chefs/show", { chef, recipes });
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
