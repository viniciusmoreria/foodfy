const db = require("../../config/db");
const fs = require("fs");

module.exports = {
  async create({ filename, path }) {
    try {
      const query = `
      INSERT INTO files (
        name,
        path
      ) VALUES ($1, $2)
      RETURNING id
    `;

      const values = [filename, path];

      const results = await db.query(query, values);

      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  },
  async delete(id) {
    try {
      const result = await db.query(`SELECT * FROM files WHERE id = $1`, [id]);
      const file = result.rows[0];

      fs.unlink(file.path, err => {
        if (err) throw err;

        return db.query(`DELETE FROM files WHERE id = $1`, [id]);
      });
    } catch (err) {
      console.error(err);
    }
  }
};
