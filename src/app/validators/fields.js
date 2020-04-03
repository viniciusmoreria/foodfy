function checkAllFields(body) {
  const keys = Object.keys(body);

  for (key of keys) {
    if (body[key] == "" && key != "removed_files") {
      return;
    }
  }
}

module.exports = {
  async post(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    try {
      if (fillAllFields) {
        return res.send("Por favor envie ao menos uma imagem", fillAllFields);
      }

      if (req.files.length == 0)
        return res.send("Por favor envie ao menos uma imagem", fillAllFields);

      next();
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res, next) {
    const fillAllFields = checkAllFields(req.body);

    try {
      if (fillAllFields) {
        return res.send("Por favor envie ao menos uma imagem", fillAllFields);
      }

      next();
    } catch (err) {
      console.error(err);
    }
  }
};
