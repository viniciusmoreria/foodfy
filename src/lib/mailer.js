const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "7a6c217de505b5",
    pass: "c8bb530cfd06e9"
  }
});
