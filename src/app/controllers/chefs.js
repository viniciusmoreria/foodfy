const Chef = require("../models/Chef");

module.exports = {
  // Logged-out routes
  async index(req, res) {
    let results = await Chef.all(req.body);
    const chefs = results.rows;

    return res.render("chefs", { chefs });
  },
  async chef(req, res) {
    let results = await Chef.find(req.params.id);

    let chef = results.rows[0];

    const recipes = results.rows;

    return res.render("show-chef", { chef, recipes });
  },

  // Logged-in routes
  async indexAdmin(req, res) {
    let results = await Chef.all(req.body);
    const chefs = results.rows;

    return res.render("admin/chefs/index", { chefs });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
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

    return res.render("admin/chefs/edit", { chef });
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
  async put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    await Chef.update(req.body);

    return res.redirect(`/admin/chefs/${req.body.id}`);
  },
  async delete(req, res) {
    await Chef.delete(req.body.id);

    return res.redirect("/admin/chefs");
  }
};
