const express = require("express");
const routes = express.Router();

const ProfileController = require("../app/controllers/ProfileController");
const SessionController = require("../app/controllers/SessionController");
const UserController = require("../app/controllers/UserController");

const ProfileValidator = require("../app/validators/profile");
const SessionValidator = require("../app/validators/session");
const UserValidator = require("../app/validators/user");

const { onlyAdmin, onlyUsers } = require("../app/middlewares/session");

// Login - Logout
routes.get("/login", SessionController.loginForm);
routes.post("/login", SessionValidator.login, SessionController.login);
routes.post("/logout", onlyUsers, SessionController.logout);

// Forgot Password - Reset
routes.get("/forgot-password", SessionController.forgotForm);
routes.get("/password-reset", SessionController.resetForm);
routes.post(
  "/forgot-password",
  SessionValidator.forgot,
  SessionController.forgot
);
routes.post("/password-reset", SessionValidator.reset, SessionController.reset);

// User Profile
routes.get("/register", ProfileController.registerForm);
routes.post("/register", ProfileValidator.post, ProfileController.post);
routes.get("/profile", ProfileValidator.show, ProfileController.show);
routes.put("/profile", ProfileValidator.update, ProfileController.put);

// Admin Profile
routes.get("/users", onlyAdmin, UserController.list);
routes.get("/users/:id", onlyAdmin, UserController.show);
routes.put("/users", UserController.update);
routes.delete("/users", UserController.delete);

module.exports = routes;
