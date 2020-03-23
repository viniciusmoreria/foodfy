const User = require("../models/User");

async function post(req, res, next) {
  //Check fields
  const keys = Object.keys(req.body);

  for (key of keys) {
    if (req.body[key] == "") {
      return res.render("admin/users/register", {
        user: req.body,
        error: "Favor preencher todos os campos"
      });
    }
  }

  //Check if user exists

  let { email, password, passwordRepeat } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user) {
    return res.render("admin/users/register", {
      user: req.body,
      error: "Usuário já cadastrado"
    });
  }

  //Check if passwords match
  if (password != passwordRepeat)
    return res.render("admin/users/register", {
      user: req.body,
      error: "Senhas não batem, favor verificar"
    });

  next();
}

module.exports = {
  post
};
