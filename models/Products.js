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

async function update(id, name, quantity) {
  if (!id || !name || !quantity) return false;
  const query = 'UPDATE products SET name = ?, quantity = ? WHERE id = ?';
  const [res] = await conn.execute(query, [name, quantity, id]);
  if (res.affectedRows === 0) return false;
  return true;
}

async function deleteById(id) {
  if (!id) return false;
  const query = 'DELETE FROM products WHERE id = ?';
  await conn.execute(query, [Number(id)]);
  return true;
}

async function getQuantity(id) {
  if (!id) return false;
  const query = 'SELECT quantity FROM products WHERE id = ?';
  const [[res]] = await conn.execute(query, [id]);
  if (!res || !res.quantity) return false;
  return res.quantity;
}

async function updateQuantity(id, quantity) {
  if (typeof id !== 'number' || typeof quantity !== 'number') return false;
  const query = 'UPDATE products SET quantity = ? WHERE id = ?';
  const [res] = await conn.execute(query, [quantity, id]);
  if (res.affectedRows === 0) return false;
  return true;
}

module.exports = {
  getAll,
  create,
  getByName,
  getById,
  update,
  deleteById,
  getQuantity,
  updateQuantity,
};
