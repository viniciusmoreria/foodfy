const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/register");
  },
  async list(req, res) {
    const id = req.params.id;
    const user = await User.findOne({ where: { id } });

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
  }
};
