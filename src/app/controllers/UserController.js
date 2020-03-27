const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/register");
  },
  async list(req, res) {
    let results = await User.all(req.body);
    const users = results.rows;

    return res.render("admin/users/index", { users });
  },
  async show(req, res) {
    const { user } = req;

    return res.render("admin/users/index", { user });
  },
  async post(req, res) {
    const userId = await User.create(req.body);

    req.session.userId = userId;

    return res.redirect(`admin/users/${userId}`);
  },
  async update(req, res) {
    try {
      let { id, name, email } = req.body;

      await User.update(id, {
        name,
        email
      });

      return res.render("admin/users/index", {
        user: req.body,
        success: "Conta atualizada com sucesso"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/index", {
        error: "Algo deu errado, por favor tente novamente"
      });
    }
  },
  async delete(req, res) {
    try {
      await User.delete(req.body.id);

      req.session.destroy();

      return res.render("admin/session/login", {
        success: "Conta deletada com sucesso"
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
