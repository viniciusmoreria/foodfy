const express = require("express");
const routes = express.Router();
const ProfileController = require("../app/controllers/ProfileController");
const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const ProfileValidator = require("../app/validators/profile");
const UserValidator = require("../app/validators/user");
const SessionValidator = require("../app/validators/session");

const { onlyUsers } = require("../app/middlewares/session");

// Login - Logout
routes.get("/login", SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", onlyUsers, SessionController.logout);

// Forgot password - Reset
// routes.get("/forgot-password", SessionController.forgotForm);
// routes.get("/password-reset", SessionController.resetForm);
// routes.post("/forgot-password", SessionController.forgot);
// routes.post("/password-reset", SessionController.reset);

// User
routes.get("/register", ProfileController.registerForm);
routes.post("/register", UserValidator.post, ProfileController.post);
routes.get("/profile", UserValidator.show, ProfileController.show);
routes.put("/profile", UserValidator.update, ProfileController.put);

// routes.get("/index", UserController.show);
// routes.put("/", UserController.update);
// routes.delete("/", UserController.delete);

module.exports = routes;
