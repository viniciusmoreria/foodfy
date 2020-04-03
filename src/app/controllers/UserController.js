const { hash } = require("bcryptjs");
const { unlinkSync } = require("fs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

const User = require("../models/User");
const Recipe = require("../models/Recipe");

module.exports = {
  async list(req, res) {
    try {
      let users = await User.findAll(req.body);

      return res.render("admin/users/index", { users });
    } catch (err) {
      console.error(err);
    }
  },
  create(req, res) {
    return res.render("admin/users/create");
  },
  async post(req, res) {
    try {
      const { name, email, admin } = req.body;
      const pass = Math.random()
        .toString(36)
        .slice(-8);
      const passwordHash = await hash(pass, 8);

      const userId = await User.create({
        name,
        email,
        password: passwordHash,
        is_admin: admin
      });

      const user = await User.findOne({ where: { id: userId } });

      const token = crypto.randomBytes(20).toString("hex");

      let now = new Date();
      now = now.setHours(now.getHours() + 1);

      await User.update(user.id, {
        reset_token: token,
        reset_token_expires: now
      });

      await mailer.sendMail({
        to: user.email,
        from: "no-reply@foodfy.com.br",
        subject: "Foodfy - Senha provisória",
        html: `<h2>Olá ${user.name},</h2>

        <p>
        Você recebeu um convite para participar do melhor site de receitas do Brasil, o Foodfy.
        Utilize a senha provisória abaixo para acessar sua conta.
        </p>

        <p>Seu login é: ${user.email}</p>
        <p>Sua senha provisória é: ${pass}</p>

        <p>Caso queira criar uma nova senha, basta acessar o link abaixo.</p>
        <p>
          <a href="http://localhost:3000/admin/password-reset?token=${token}" target="_blank">Criar nova senha</a>
        </p>
        `
      });

      let users = await User.findAll();

      return res.render("admin/users/index", {
        users,
        success: "Usuário adicionado com sucesso"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/index", {
        users,
        error: "Algo de errado ocorreu, favor tente novamente"
      });
    }
  },
  async show(req, res) {
    try {
      const { user } = req;

      return res.render("admin/users/show", { user });
    } catch (err) {
      console.error(err);
    }
  },
  async put(req, res) {
    try {
      let { id, name, email, admin = false } = req.body;

      await User.update(id, { name, email, is_admin: admin });

      let users = await User.findAll();

      return res.render("admin/users/index", {
        users,
        success: "Conta atualizada com sucesso"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/index", {
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  },
  async delete(req, res) {
    try {
      const recipes = await Recipe.findAll({ where: { user_id: req.body.id } });

      const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id));

      let promiseResults = await Promise.all(allFilesPromise);

      await User.delete(req.body.id);

      promiseResults.map(files => {
        files.map(file => {
          try {
            unlinkSync(file.path);
          } catch (err) {
            console.error(err);
          }
        });
      });

      let users = await User.findAll();

      return res.render("admin/users/index", {
        users,
        success: "Conta deletada com sucesso"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/users/index", {
        users,
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  }
};
