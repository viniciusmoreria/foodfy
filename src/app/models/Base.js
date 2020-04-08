const db = require("../../config/db");

function find(filters, table) {
  try {
    let query = `SELECT * FROM ${table}`;

    if (filters) {
      Object.keys(filters).map((key) => {
        query += ` ${key}`;

        Object.keys(filters[key]).map((field) => {
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
  async findOne(filter) {
    let query = `SELECT * FROM ${this.table}`;
    Object.keys(filter).map((key) => {
      query += ` ${key}`;

      Object.keys(filter[key]).map((field) => {
        query += ` ${field} = '${filter[key][field]}'`;
      });
    });
    const results = await db.query(query);
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
  update(id, fields) {
    try {
      let position = [],
        values = [],
        update = [];

      Object.keys(fields).map((key, index, array) => {
        if (index < array.length) {
          position = `$${index + 1}`;
        }
        values.push(fields[key]);

        let line = `${key} = (${position})`;
        update.push(line);
      });

      let query = `UPDATE ${this.table} SET
        ${update.join(",")} WHERE id = ${id}`;

      return db.query(query, values);
    } catch (error) {
      console.error(error);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
    } catch (err) {
      console.error(err);
    }
  },
};

module.exports = Base;
