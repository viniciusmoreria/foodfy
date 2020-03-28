const User = require("../models/User");

module.exports = {
  async show(req, res, next) {
    const id = req.params.id;
    try {
      const user = await User.findOne({ where: { id } });

      if (!user)
        return res.render("admin/users/index", {
          error: "Usuário não encontrado"
        });

      req.user = user;

      next();
    } catch (err) {
      console.error(err);
      return res.render("admin/users/index", {
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  }
};
