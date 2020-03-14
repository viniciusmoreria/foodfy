const Chef = require("../models/Chef");

module.exports = {
  // Logged-out routes
  index(req, res) {
    Chef.all(function(chefs) {
      return res.render("chefs", { chefs });
    });
  },
  chef(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Recipe not found!");

      return res.render("show-chef", { chef });
    });
  },

  // Logged-in routes
  indexAdmin(req, res) {
    Chef.all(function(chefs) {
      return res.render("admin/chefs/index", { chefs });
    });
  },
  create(req, res) {
    return res.render("admin/chefs/create");
  },
  show(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef not found!");

      return res.render("admin/chefs/show", { chef });
    });
  },
  edit(req, res) {
    Chef.find(req.params.id, function(chef) {
      if (!chef) return res.send("Chef not found!");

      return res.render("admin/chefs/edit", { chef });
    });
  },
  post(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    Chef.create(req.body, function(chef) {
      return res.redirect(`/admin/chefs/${chef.id}`);
    });
  },
  put(req, res) {
    const keys = Object.keys(req.body);

    for (key of keys) {
      if (req.body[key] == "") {
        return res.send("Please, fill all fields!");
      }
    }

    Chef.update(req.body, function() {
      return res.redirect(`/admin/chefs/${req.body.id}`);
    });
  },
  delete(req, res) {
    Chef.delete(req.body.id, function() {
      return res.redirect("/admin/chefs");
    });
  }
};
