const db = require("../../config/db");

const Base = require("./Base");

Base.init({ table: "recipes" });

module.exports = {
  ...Base,
  async all() {
    const results = await db.query(
      `
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      ORDER BY updated_at DESC
      `
    );

    return results.rows;
  },
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
  async chefName() {
    try {
      const results = await db.query(`SELECT name, id FROM chefs`);

      return results.rows;
    } catch (err) {
      console.error(err);
    }
  },
  async paginate(params) {
    try {
      const { filter, limit, offset } = params;

      let query = "",
        filterQuery = "",
        totalQuery = `(SELECT count(*) FROM recipes) AS total`;

      if (filter) {
        filterQuery = `
        WHERE recipes.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'
        `;

        totalQuery = `(
        SELECT count (*) FROM recipes
        ${filterQuery}
        ) as total`;
      }

      query = `
          SELECT recipes.*, ${totalQuery}, chefs.name AS chef_name
          FROM recipes
          LEFT JOIN chefs ON(recipes.chef_id = chefs.id)
          ${filterQuery}
          ORDER BY updated_at DESC
          LIMIT $1 OFFSET $2`;

      const results = await db.query(query, [limit, offset]);
      return results.rows;
    } catch (err) {
      console.error(err);
    }
  },
  async files(id) {
    try {
      const results = await db.query(
        `
      SELECT files.*, recipe_files.recipe_id as recipe_id
      FROM files 
      LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
      WHERE recipe_files.recipe_id = $1`,
        [id]
      );

      return results.rows;
    } catch (err) {
      console.error(err);
    }
  },
};
