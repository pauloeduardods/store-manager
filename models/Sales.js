const conn = require('./connection');

async function create(sales) {
  if (!sales || sales.length === 0) return false;
  if (sales.some((sale) => !sale.productId || !sale.quantity)) return false;
  const createSale = 'INSERT INTO sales (id) VALUES (NULL)';
  const [res] = await conn.execute(createSale);
  const saleId = res.insertId;
  const query = 'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)';
  const ArrayOfPromise = sales.map(async ({ productId, quantity }) =>
    conn.execute(query, [saleId, productId, quantity]));
  await Promise.all(ArrayOfPromise);
  return saleId;
}

async function getAll() {
  const query = `
  SELECT sp.sale_id as saleId, sp.product_id, sp.quantity, s.date
  FROM sales_products sp
  JOIN sales s
  ON sp.sale_id = s.id`;
  const [res] = await conn.execute(query);
  return res;
}

async function getById(id) {
  if (!id) return false;
  const query = `
  SELECT sp.product_id, sp.quantity, s.date
  FROM sales_products sp
  JOIN sales s
  ON sp.sale_id = s.id
  WHERE sp.sale_id = ?`;
  const [res] = await conn.execute(query, [id]);
  return res;
}

const saleValidator = (sales) =>
  (!sales || sales.length === 0 || sales.some((sale) => !sale.productId || !sale.quantity));

async function update(id, sales) {
  if (!id || saleValidator(sales)) return false;
  const deleteQuery = 'DELETE FROM sales_products WHERE sale_id = ?';
  const [res] = await conn.execute(deleteQuery, [id]);
  if (res.affectedRows === 0) return false;
  const query = 'INSERT INTO sales_products (sale_id, product_id, quantity) VALUES (?, ?, ?)';
  const ArrayOfPromise = sales.map(async ({ productId, quantity }) =>
    conn.execute(query, [id, productId, quantity]));
  await Promise.all(ArrayOfPromise);
  return true;
}

async function deleteById(id) {
  if (!id) return false;
  const sales = await getById(id);
  if (!sales || sales.length === 0) return false;
  const deleteSalesProducts = 'DELETE FROM sales_products WHERE sale_id = ?';
  const deleteSales = 'DELETE FROM sales WHERE id = ?';
  await conn.execute(deleteSalesProducts, [id]);
  await conn.execute(deleteSales, [id]);
  return sales;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
