const db = require("../../config/db");
const { date } = require("../../lib/utils");
const { hash } = require("bcryptjs");

const fs = require("fs");
const Recipe = require("../models/Recipe");

module.exports = {
  all() {
    try {
      return db.query(
        `
      SELECT * FROM users
      ORDER BY updated_at DESC
      `
      );
    } catch (err) {
      console.error(err);
    }
  },
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
  },
  async update(id, fields) {
    try {
      let query = "UPDATE users SET";

      Object.keys(fields).map((key, index, array) => {
        if (index + 1 < array.length) {
          query = `${query}
          ${key} = '${fields[key]}',
          `;
        } else {
          query = `${query}
          ${key} = '${fields[key]}'
          WHERE id = ${id}`;
        }
      });

      await db.query(query);
      return;
    } catch (err) {
      console.error(err);
    }
  },
  async delete(id) {
    try {
      let results = await db.query("SELECT * FROM recipes WHERE user_id = $1", [
        id
      ]);
      const recipes = results.rows;

      const allFilesPromise = recipes.map(recipe => Recipe.files(recipe.id));

      let promiseResults = await Promise.all(allFilesPromise);

      await db.query("DELETE FROM users WHERE id = $1", [id]);

      promiseResults.map(results => {
        results.rows.map(file => fs.unlinkSync(file.path));
      });
    } catch (err) {
      console.error(err);
    }
  }
};
