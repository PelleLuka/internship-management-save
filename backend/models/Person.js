import pool from '../config/db.js';

const Person = {
  create: async (data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(
        'INSERT INTO person (first_name, last_name, email) VALUES (?, ?, ?)',
        [data.firstName, data.lastName, data.email]
      );
      return Number(res.insertId);
    } finally {
      if (conn) conn.end();
    }
  },

  getById: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM person WHERE id = ?', [id]);
      if (!rows[0]) return null;
      return {
        id: rows[0].id,
        firstName: rows[0].first_name,
        lastName: rows[0].last_name,
        email: rows[0].email,
      };
    } finally {
      if (conn) conn.end();
    }
  },

  update: async (id, data) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const fields = [];
      const values = [];
      if (data.firstName !== undefined) { fields.push('first_name = ?'); values.push(data.firstName); }
      if (data.lastName !== undefined) { fields.push('last_name = ?'); values.push(data.lastName); }
      if (data.email !== undefined) { fields.push('email = ?'); values.push(data.email); }
      if (!fields.length) return false;
      values.push(id);
      const res = await conn.query(`UPDATE person SET ${fields.join(', ')} WHERE id = ?`, values);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },

  delete: async (id) => {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('DELETE FROM person WHERE id = ?', [id]);
      return res.affectedRows > 0;
    } finally {
      if (conn) conn.end();
    }
  },
};

export default Person;
