const { date } = require("../../lib/utils");
const db = require("../../config/db");

module.exports = {
  all() {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        ORDER BY created_at DESC`
      );
    } catch (err) {
      console.error(err);
    }
  },
  create(data) {
    try {
      const query = `
      INSERT INTO recipes (
        chef_id,
        user_id,
        title,
        ingredients,
        preparation,
        information,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
    `;

      const values = [
        data.chef,
        data.user_id,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        date(Date.now()).iso
      ];

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  find(id) {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.id = $1
        `,
        [id]
      );
    } catch (err) {
      console.error(err);
    }
  },
  findBy(filter) {
    try {
      return db.query(
        `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes 
        LEFT JOIN chefs on (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        OR chefs.name ILIKE '%${filter}%'
        ORDER BY updated_at ASC`
      );
    } catch (err) {
      console.error(err);
    }
  },
  update(data) {
    try {
      const query = `
      UPDATE recipes SET
      chef_id=($1),
      title=($2),
      ingredients=($3),
      preparation=($4),
      information=($5)
      WHERE id = $6
      `;

      const values = [
        data.chef,
        data.title,
        data.ingredients,
        data.preparation,
        data.information,
        data.id
      ];

      return db.query(query, values);
    } catch (err) {
      console.error(err);
    }
  },
  delete(id) {
    try {
      return db.query(`DELETE FROM recipes WHERE id = $1`, [id]);
    } catch (err) {
      console.error(err);
    }
  },
  chefName() {
    try {
      return db.query(`SELECT name, id FROM chefs`);
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
  files(id) {
    return db.query(
      `
    SELECT files.*, recipe_files.recipe_id as recipe_id
    FROM files 
    LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
    WHERE recipe_files.recipe_id = $1`,
      [id]
    );
  }
};
