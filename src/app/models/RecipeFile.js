const db = require("../../config/db");

module.exports = {
  create({ recipe_id, file_id }) {
    const query = `
            INSERT INTO recipe_files(
                recipe_id,
                file_id
            ) VALUES ($1, $2)
            RETURNING id`;

    const values = [recipe_id, file_id];
    return db.query(query, values);
  }
};
