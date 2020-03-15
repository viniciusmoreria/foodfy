const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all(callback) {
    db.query(
      `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs on (recipes.chef_id = chefs.id)
      ORDER BY created_at DESC`,
      function(err, results) {
        if (err) throw `Recipe not found! ${err}`;

        callback(results.rows);
      }
    );
  },
  create(data, callback) {
    const query = `
      INSERT INTO recipes (
        chef_id,
        title,
        image,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

    const values = [
      data.chef,
      data.title,
      data.image,
      data.ingredients,
      data.preparation,
      data.information,
      date(Date.now()).iso
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Recipe not found! ${err}`;

      callback(results.rows[0]);
    });
  },
  find(id, callback) {
    db.query(
      `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes 
      LEFT JOIN chefs on (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1
      `,
      [id],
      function(err, results) {
        if (err) throw `Recipe not found! ${err}`;

        callback(results.rows[0]);
      }
    );
  },
  update(data, callback) {
    const query = `
    UPDATE recipes SET
    chef_id=($1),
    title=($2),
    image=($3),
    ingredients=($4),
    preparation=($5),
    information=($6)
    WHERE id = $7
    `;

    const values = [
      data.chef,
      data.title,
      data.image,
      data.ingredients,
      data.preparation,
      data.information,
      data.id
    ];

    db.query(query, values, function(err, results) {
      if (err) throw `Recipe not found! ${err}`;

      callback();
    });
  },
  delete(id, callback) {
    db.query(`DELETE FROM recipes WHERE id = $1`, [id], function(err, results) {
      if (err) throw `Recipe not found! ${err}`;

      return callback();
    });
  },
  chefName(callback) {
    db.query(`SELECT name, id FROM chefs`, function(err, results) {
      if (err) throw `Database error! ${err}`;

      callback(results.rows);
    });
  }
};
