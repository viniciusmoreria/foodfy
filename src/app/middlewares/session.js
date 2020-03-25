module.exports = {
  onlyUsers(req, res, next) {
    if (!req.session.userId) {
      return res.redirect("admin/session/login");
    }

    next();
  },
  isLogged(req, res, next) {
    if (req.session.userId) return res.redirect(`/users/register`);

    next();
  }
};
