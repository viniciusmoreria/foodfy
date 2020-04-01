const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  async find(id) {
    try {
      const results = await db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `,
        [id]
      );

      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  },
  chefName() {
    try {
      return db.query(`SELECT name, id FROM chefs`);
    } catch (err) {
      console.error(err);
    }
  }
};
