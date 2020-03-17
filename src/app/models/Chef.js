const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all() {
    try {
      return db.query(
        `
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC
      `
      );
    } catch (err) {
      console.error(err);
    }
  },
  create(data) {
    try {
      const query = `
      INSERT INTO chefs (
        name,
        image,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

      const values = [data.name, data.image, date(Date.now()).iso];

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  find(id) {
    try {
      return db.query(
        `
          SELECT chefs.*, 
          (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes,
          recipes.id AS recipe_id, recipes.title AS recipe_title, recipes.image AS recipe_image
          FROM chefs
          LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
          WHERE chefs.id = $1
          `,
        [id]
      );
    } catch (err) {
      console.error(err);
    }
  },
  update(data) {
    try {
      const query = `
      UPDATE chefs SET
      name=($1),
      image=($2)
      WHERE id = $3
      `;

      const values = [data.name, data.image, data.id];

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM chefs WHERE id = $1`, [id]);
    } catch (err) {
      console.error(err);
    }
  }
};
