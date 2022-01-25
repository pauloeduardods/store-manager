const conn = require('./connection');

async function getAll() {
  const [res] = await conn.execute('SELECT * FROM products');
  return res;
}

async function create(name, quantity) {
  if (!name || !quantity) return false;
  const query = 'INSERT INTO products (name, quantity) VALUES (?, ?)';
  const [res] = await conn.execute(query, [name, quantity]);
  return res.insertId;
}

async function getByName(name) {
  if (!name) return false;
  const query = 'SELECT * FROM products WHERE name = ?';
  const [res] = await conn.execute(query, [name]);
  return res;
}

async function getById(id) {
  if (!id) return false;
  const query = 'SELECT * FROM products WHERE id = ?';
  const [[res]] = await conn.execute(query, [id]);
  return res || false;
}

module.exports = {
  getAll,
  create,
  getByName,
  getById,
};
