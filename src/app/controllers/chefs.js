const { date } = require("../../lib/utils");

const Chef = require("../models/Chef");
const ChefService = require("../services/ChefService");
const File = require("../models/File");
const DeleteService = require("../services/DeleteService");

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
      const filePromise = req.files.map((file) =>
        File.create({
          name: file.filename,
          path: file.path,
        })
      );

      const filesId = await Promise.all(filePromise);

      const relationPromise = filesId.map((fileId) =>
        Chef.create({
          ...req.body,
          created_at: date(Date.now()).iso,
          file_id: fileId,
        })
      );

      await Promise.all(relationPromise);

      return res.render("admin/parts/success", {
        type: "Chef",
        action: "cadastrado",
      });
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
      files = files.map((file) => ({
        ...file,
        src: files[0].path.replace("public", ""),
      }));

      return res.render("admin/chefs/edit", { chef, files });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    let { name } = req.body;

    if (req.files.length != 0) {
      const file = req.files[0];
      let fileId = await File.create({ name: file.filename, path: file.path });

      await Chef.update(req.body.id, {
        name,
        file_id: fileId,
      });
    } else {
      if (req.body.removed_files != "" && req.files[0] == undefined)
        return res.render("admin/parts/error", {
          type: "Ao menos uma imagem deve ser enviada!",
        });
    }

    if (req.body.removed_files) {
      DeleteService.removedFiles(req.body);
    }

    await Chef.update(req.body.id, {
      name,
    });

    return res.render("admin/parts/success", {
      type: "Chef",
      action: "atualizado",
    });
  },
  async delete(req, res) {
    try {
      const files = await Chef.files(req.body.id);
      await Chef.delete(req.body.id);

      DeleteService.deleteFiles(files);

      return res.render("admin/parts/success", {
        type: "Chef",
        action: "deletado",
      });
    } catch (err) {
      console.error(err);
    }
  },
};
