const User = require("../models/User");

module.exports = {
  registerForm(req, res) {
    return res.render("admin/users/register");
  },
  show(req, res) {
    return res.send("Ok");
  },
  async post(req, res) {
    const userId = await User.create(req.body);

    return res.redirect("admin/users");
  }
};
