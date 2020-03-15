const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all(callback) {
    db.query(
      `
    SELECT chefs.*, count(recipes) AS total_recipes
    FROM chefs
    LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
    GROUP BY chefs.id
    ORDER BY total_recipes DESC
    `,
      function(err, results) {
        if (err) throw `Chef not found! ${err}`;

        callback(results.rows);
      }
    );
  },
  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        image,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `;

    const values = [data.name, data.image, date(Date.now()).iso];

    db.query(query, values, function(err, results) {
      if (err) throw `Chef not found! ${err}`;

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query(
      `
      SELECT chefs.*, 
      (SELECT count(*) FROM recipes WHERE recipes.chef_id = chefs.id) AS total_recipes,
      recipes.id AS recipe_id, recipes.title AS recipe_title, recipes.image AS recipe_image
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      `,
      [id],
      function(err, results) {
        if (err) throw `Chef not found! ${err}`;

        callback(results.rows[0], results.rows);
      }
    );
  },
  update(data, callback) {
    const query = `
    UPDATE chefs SET
    name=($1),
    image=($2)
    WHERE id = $3
    `;

    const values = [data.name, data.image, data.id];

    db.query(query, values, function(err, results) {
      if (err) throw `Chef not found! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM chefs WHERE id = $1`, [id], function(err, results) {
      if (err) throw `Chef not found! ${err}`;

      return callback();
    });
  }
};
