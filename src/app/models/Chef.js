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
        created_at,
        file_id
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

      const values = [data.name, date(Date.now()).iso, data.fileId];

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  find(id) {
    try {
      return db.query(
        `
          SELECT chefs.*, count(recipes) AS total_recipes
          FROM chefs
          LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
          WHERE chefs.id = $1
          GROUP BY chefs.id
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
      file_id=($2)
      WHERE id = $3
      `;

      const values = [data.name, data.fileId, data.id];

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
  },
  recipes() {
    try {
      return db.query(`
      SELECT id, chef_id, title
      FROM recipes
      ORDER BY created_at DESC`);
    } catch (err) {
      console.error(err);
    }
  },
  files(id) {
    return db.query(
      `
    SELECT *
    FROM files 
    LEFT JOIN chefs ON (files.id = chefs.file_id)
    WHERE chefs.id = $1`,
      [id]
    );
  }
};
