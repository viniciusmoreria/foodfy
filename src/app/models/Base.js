const db = require("../../config/db");

function find(filters, table) {
  try {
    let query = `SELECT * FROM ${table}`;

    if (filters) {
      Object.keys(filters).map(key => {
        query += ` ${key}`;

        Object.keys(filters[key]).map(field => {
          query += ` ${field} = '${filters[key][field]}'`;
        });
      });
    }

    return db.query(query);
  } catch (err) {
    console.error(err);
  }
}

const Base = {
  init({ table }) {
    if (!table) throw new Error("Parâmetros inválidos");

    this.table = table;

    return this;
  },
  async find(id) {
    const results = await find({ where: { id } }, this.table);
    return results.rows[0];
  },
  async findOne(filters) {
    const results = await find(filters, this.table);
    return results.rows[0];
  },
  async findAll(filters) {
    const results = await find(filters, this.table);
    return results.rows;
  },
  async create(fields) {
    try {
      let keys = [],
        values = [],
        position = [];

      Object.keys(fields).map((key, index, array) => {
        keys.push(key);
        values.push(fields[key]);

        if (index < array.length) {
          position.push(`$${index + 1}`);
        }
      });
      const query = `
        INSERT INTO ${this.table} (${keys.join(",")})
        VALUES (${position.join(",")})
        RETURNING id`;

      const results = await db.query(query, values);
      return results.rows[0].id;
    } catch (error) {
      console.error(`create error ${error}`);
    }
  },
  async update(id, fields) {
    try {
      let update = [];

      Object.keys(fields).map(key => {
        const line = `${key} = '${fields[key]}'`;
        update.push(line);
      });

      let query = `UPDATE ${this.table} SET
      ${update.join(",")} WHERE id = ${id}`;

      await db.query(query);
      return;
    } catch (err) {
      console.error(err);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    } catch (err) {
      console.error(err);
    }
  },
  paginate(params) {
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

      return db.query(query, [limit, offset]);
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
  }
};

module.exports = Base;
