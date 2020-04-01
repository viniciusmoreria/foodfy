const { hash } = require("bcryptjs");
const { date } = require("../../lib/utils");

const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/profile/register");
  },
  async post(req, res) {
    try {
      let { name, email, password, admin = false } = req.body;

      const passwordHash = await hash(password, 8);

      const userId = await User.create({
        name,
        email,
        passwordHash,
        is_admin: admin,
        created_at: date(Date.now()).iso
      });

      const user = await User.findOne({ where: { id: userId } });

      req.session.userId = user.id;
      req.session.admin = user.is_admin;

      return res.redirect("/admin/profile");
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res) {
    try {
      const { user } = req;

      return res.render("admin/profile/index", { user });
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
      return res.render("admin/profile/index", {
        user: req.body,
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  }
};
