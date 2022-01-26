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

module.exports = {
  create,
};
