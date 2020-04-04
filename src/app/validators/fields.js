function checkAllFields(fields) {
  const keys = Object.keys(fields);
  for (key of keys) {
    if (fields[key] == "" && key != "information" && key != "removed_files")
      return true;
  }
}

module.exports = {
  post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) {
      return res.render("admin/parts/error", {
        type: "Todos os campos devem ser preenchidos!",
      });
    }

    if (req.files.length == 0) {
      return res.render("admin/parts/error", {
        type: "Ao menos uma imagem deve ser enviada!",
      });
    }
    next();
  },

  put(req, res, next) {
    const fillAllFields = checkAllFields(req.body);
    if (fillAllFields) {
      return res.render("admin/parts/error", {
        type: "Todos os campos devem ser preenchidos!",
      });
    }

    if (req.body.removed_files != "" && req.files[0] == undefined)
      return res.render("admin/parts/error", {
        type: "Ao menos uma imagem deve ser enviada!",
      });
    next();
  },
};
