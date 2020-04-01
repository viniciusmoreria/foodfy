const Recipe = require("../models/Recipe");

module.exports = {
  onlyUsers(req, res, next) {
    if (!req.session.userId) return res.redirect("/admin/login");

    next();
  },
  onlyAdmin(req, res, next) {
    if (!req.session.userId) return res.redirect("/admin/profile");

    if (!req.session.admin) {
      return res.redirect("/admin/profile");
    }

    next();
  },
  async posterAdmin(req, res, next) {
    if (!req.session.userId) return res.redirect("/admin/login");

    let id = req.params.id;
    if (!id) id = req.body.id;

    const recipe = await Recipe.find(id);
    user = recipe.user_id;

    if (
      req.session.userId &&
      user != req.session.userId &&
      req.session.admin == false
    )
      return res.redirect(`/admin/recipes/${id}`);

    next();
  }
};
