const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all(callback) {
    db.query(`SELECT * FROM chefs`, function(err, results) {
      if (err) throw `Chef not found! ${err}`;

      callback(results.rows);
    });
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
      SELECT * 
      FROM chefs 
      WHERE id = $1
      `,
      [id],
      function(err, results) {
        if (err) throw `Chef not found! ${err}`;

        callback(results.rows[0]);
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
