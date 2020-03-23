const db = require("../../config/db");
const { date } = require("../../lib/utils");
const { hash } = require("bcryptjs");

module.exports = {
  async findOne(filter) {
    try {
      let query = "SELECT * FROM users";

      Object.keys(filter).map(key => {
        query = `${query} ${key}`;

        Object.keys(filter[key]).map(field => {
          query = `${query} ${field} = '${filter[key][field]}'`;
        });
      });

      const results = await db.query(query);
      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  },
  async create(data) {
    try {
      const query = `
      INSERT INTO users (
        name,
        email,
        password,
        is_admin,
        created_at
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

      //password hash
      const passwordHash = await hash(data.password, 8);

      const values = [
        data.name,
        data.email,
        passwordHash,
        data.is_admin,
        date(Date.now()).iso
      ];

      const results = await db.query(query, values);
      return results.rows[0].id;
    } catch (err) {
      console.error(err);
    }
  }
};
