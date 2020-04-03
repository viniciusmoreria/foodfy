const { date } = require("../../lib/utils");
const { unlinkSync } = require("fs");

const Chef = require("../models/Chef");
const ChefService = require("../services/ChefService");
const File = require("../models/File");

module.exports = {
  async index(req, res) {
    try {
      const chefs = await ChefService.load("chefs");

      return res.render("admin/chefs/index", { chefs });
    } catch (err) {
      console.error(err);
    }
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  async post(req, res) {
    try {
      const filePromise = req.files.map(file =>
        File.create({
          name: file.filename,
          path: file.path
        })
      );

      const filesId = await Promise.all(filePromise);

      const relationPromise = filesId.map(fileId =>
        Chef.create({
          ...req.body,
          created_at: date(Date.now()).iso,
          file_id: fileId
        })
      );

      await Promise.all(relationPromise);

      return res.redirect(`/admin/chefs`);
    } catch (err) {
      console.error(err);
    }
  },
  async show(req, res) {
    try {
      let chef = await ChefService.load("chef", req.params.id);
      if (!chef) return res.send("Chef não encontrado");

      let image = await Chef.files(chef.id);
      if (image[0]) image.src = image[0].path.replace("public", "");

      const recipes = await ChefService.load("recipes");

      return res.render("admin/chefs/show", { chef, image, recipes });
    } catch (err) {
      console.error(err);
    }
  },
  async edit(req, res) {
    try {
      let chef = await Chef.find(req.params.id);

      if (!chef) return res.send("Chef não encontrado");

      let files = await Chef.files(chef.id);
      files = files.map(file => ({
        ...file,
        src: files[0].path.replace("public", "")
      }));

      return res.render("admin/chefs/edit", { chef, files });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (let key of keys) {
      if (req.body[key] == "" && key != "removed_files") {
        return res.send("Por favor preencha todos os campos");
      }
    }

    let { name } = req.body;

    if (req.files.length != 0) {
      const newFilesPromise = req.files.map(file =>
        File.create({
          name: file.filename,
          path: file.path
        })
      );
      const fileId = await Promise.all(newFilesPromise);

      await Chef.update(req.body.id, {
        name,
        file_id: fileId
      });
    }

    if (req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(",");
      const lastIndex = removedFiles.length - 1;
      removedFiles.splice(lastIndex, 1);

      const removedFilesPromise = removedFiles.map(async id => {
        try {
          const file = await File.findOne({ where: { id } });
          File.delete(id);
          unlinkSync(file.path);
        } catch (err) {
          console.error(err);
        }
      });

      await Promise.all(removedFilesPromise);
    }

    await Chef.update(req.body.id, {
      name
    });

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    try {
      const files = await Chef.files(req.body.id);

      files.map(file => {
        try {
          unlinkSync(file.path);
        } catch (err) {
          console.error(err);
        }
      });

      await File.delete(files[0].id);
      await Chef.delete(req.body.id);

      return res.redirect("/admin/chefs");
    } catch (err) {
      console.error(err);
    }
  }
};
