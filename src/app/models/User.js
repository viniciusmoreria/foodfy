const db = require("../../config/db");
const Base = require("./Base");

Base.init({ table: "users" });

module.exports = {
  ...Base
};
