import { withConnection } from '../config/db.js';

const Category = {
  getAll: async () => {
    return withConnection(async (conn) => {
      const rows = await conn.query(`
        SELECT c.id, c.name, c.description,
               COUNT(CASE WHEN a.visible = 1 THEN 1 END) as activity_count
        FROM category c
        LEFT JOIN activity_category ac ON ac.category_id = c.id
        LEFT JOIN activity a ON a.id = ac.activity_id
        GROUP BY c.id
        ORDER BY c.name
      `);
      return rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        activityCount: Number(row.activity_count),
      }));
    });
  },

  getById: async (id) => {
    return withConnection(async (conn) => {
      const rows = await conn.query(
        `
        SELECT c.id, c.name, c.description,
               COUNT(ac.category_id) as activity_count
        FROM category c
        LEFT JOIN activity_category ac ON ac.category_id = c.id
        WHERE c.id = ?
        GROUP BY c.id
      `,
        [id],
      );
      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        name: rows[0].name,
        description: rows[0].description,
        activityCount: Number(rows[0].activity_count),
      };
    });
  },

  create: async (data) => {
    return withConnection(async (conn) => {
      const res = await conn.query(
        'INSERT INTO category (name, description) VALUES (?, ?)',
        [data.name, data.description ?? null],
      );
      return Number(res.insertId);
    });
  },

  update: async (id, data) => {
    return withConnection(async (conn) => {
      const fields = [];
      const values = [];
      if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
      }
      if (data.description !== undefined) {
        fields.push('description = ?');
        values.push(data.description);
      }
      if (!fields.length) return false;
      values.push(id);
      const res = await conn.query(
        `UPDATE category SET ${fields.join(', ')} WHERE id = ?`,
        values,
      );
      return res.affectedRows > 0;
    });
  },

  delete: async (id) => {
    return withConnection(async (conn) => {
      const res = await conn.query('DELETE FROM category WHERE id = ?', [id]);
      return res.affectedRows > 0;
    });
  },
};

export default Category;
