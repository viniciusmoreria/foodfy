const User = require("../models/User");

module.exports = {
  async post(req, res, next) {
    //Check if user exists
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.render("admin/profile/register", {
        user: req.body,
        error: "Usuário já cadastrado"
      });
    }

    next();
  }
};
