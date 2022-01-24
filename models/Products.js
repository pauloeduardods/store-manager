const conn = require('./connection');

async function getAll() {
  try {
    const [res] = await conn.execute('SELECT * FROM products');
    return res;
  } catch (err) {
    return err;
  }
}

async function create(name, quantity) {
  if (!name || !quantity) {
    return false;
  }
  try {
    const query = 'INSERT INTO products (name, quantity) VALUES (?, ?)';
    const [res] = await conn.execute(query, [name, quantity]);
    return res.insertId;
  } catch (err) {
    return err;
  }
}

async function getByName(name) {
  if (!name) return false;
  try {
    const query = 'SELECT * FROM products WHERE name = ?';
    const [res] = await conn.execute(query, [name]);
    return res;
  } catch (err) {
    return err;
  }
}

module.exports = {
  getAll,
  create,
  getByName,
};
