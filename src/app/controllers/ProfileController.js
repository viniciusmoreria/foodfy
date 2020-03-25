const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/profile/register");
  },
  async post(req, res, next) {
    const userId = await User.create(req.body);

    const user = await User.findOne({ where: { id: userId } });

    req.session.userId = user.id;
    req.session.admin = user.is_admin;

    return res.redirect("/admin/profile");
  },

  async show(req, res) {
    const { user } = req;

    return res.render("admin/profile/index", { user });
  },

  async put(req, res) {
    try {
      let { name, email } = req.body;
      const { user } = req;

      await User.update(user.id, { name, email });

      return res.render("admin/profile/index", {
        user: req.body,
        success: "Conta atualizada com sucesso"
      });
    } catch {
      return res.render("admin/profile/index", {
        user: req.body,
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  }
};
