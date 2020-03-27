const User = require("../models/User");
const { compare } = require("bcryptjs");

function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "") {
      return {
        user: body,
        error: "Favor preencher todos os campos"
      };
    }
  }
}

module.exports = {
  async post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    try {
      if (fillAllFields) {
        return res.render("admin/profile/register", fillAllFields);
      }

      let { email, password, passwordRepeat } = req.body;

      const user = await User.findOne({ where: { email } });

      if (user) {
        return res.render("admin/profile/register", {
          user: req.body,
          error: "Usuário já cadastrado"
        });
      }

      if (password != passwordRepeat)
        return res.render("admin/profile/register", {
          user: req.body,
          error: "Senhas não batem, favor verificar"
        });

      next();
    } catch (err) {
      console.error(err);
    }
  },

  async show(req, res, next) {
    const { userId: id } = req.session;
    try {
      const user = await User.findOne({ where: { id } });

      if (!user)
        return res.render("admin/profile/register", {
          error: "Usuário não encontrado"
        });

      req.user = user;

      next();
    } catch (err) {
      console.error(err);
    }
  },

  async update(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    try {
      if (fillAllFields) {
        return res.render("admin/profile/index", fillAllFields);
      }

      const { id, password } = req.body;

      if (!password)
        return res.render("admin/profile/index", {
          user: req.body,
          error: "Digite sua senha para atualizar"
        });

      const user = await User.findOne({ where: { id } });
      const passed = await compare(password, user.password);

      if (!passed)
        return res.render("admin/profile/index", {
          user: req.body,
          error: "Senha incorreta"
        });

      req.user = user;

      next();
    } catch (err) {
      console.error(err);
    }
  }
};
