const User = require("../models/User");

const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");

module.exports = {
  loginForm(req, res) {
    return res.render("admin/session/login");
  },
  login(req, res) {
    req.session.userId = req.user.id;
    req.session.admin = req.user.is_admin;

    return res.redirect("/admin/users");
  },
  logout(req, res) {
    req.session.destroy();
    return res.redirect("/");
  },
  forgotForm(req, res) {
    return res.render("admin/session/forgot-password");
  },
  async forgot(req, res) {
    const user = req.user;

    try {
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
        subject: "Recuperação de senha",
        html: `<h2>Olá ${user.name},</h2>

        <p>Uma solicitação de recuperação de senha foi realizada para sua conta. Se você não foi o autor, apenas descarte esse e-mail.</p>
        
        <p>Para continuar com a recuperação de senha clique no botão abaixo para criar uma nova senha. Ah, esse link expira em 24h.</p>

        <p>
          <a href="http://localhost:3000/admin/password-reset?token=${token}" target="_blank">Criar nova senha</a>
        </p>
        `
      });

      return res.render("admin/session/forgot-password", {
        success: "Instruções enviadas, verifique seu e-mail"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/session/forgot-password", {
        error: "Algo de errado ocorreu, favor tente novamente"
      });
    }
  },
  resetForm(req, res) {
    return res.render("admin/session/password-reset", {
      token: req.query.token
    });
  },
  async reset(req, res) {
    const { user } = req;
    const { password, token } = req.body;

    try {
      const newPassword = await hash(password, 8);

      await User.update(user.id, {
        password: newPassword,
        reset_token: "",
        reset_token_expires: ""
      });

      return res.render("admin/session/login", {
        user: req.body,
        success: "Senha atualizada com sucesso"
      });
    } catch (err) {
      console.error(err);
      return res.render("admin/session/password-reset", {
        user: req.body,
        token,
        error: "Algo de errado ocorreu, por favor tente novamente"
      });
    }
  }
};
