const express = require("express");
const routes = express.Router();
// const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const Validator = require("../app/validators/user");

// //Login / Logout
// routes.get("/login", SessionController.loginForm);
// routes.post("/login", SessionController.login);
// routes.post("/logout", SessionController.logout);

// //Forgot password / Reset
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// //User register
routes.get("/register", UserController.registerForm);
routes.post("/register", Validator.post, UserController.post);

routes.get("/", UserController.show);
// routes.put("/", UserController.update);
// routes.delete("/", UserController.delete);

module.exports = routes;
