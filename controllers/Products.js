const Products = require('../services/Products');

async function create(req, res, next) {
  const { name, quantity } = req.body;
  const product = await Products.create(name, quantity);
  if (product.errCode) {
    return next(product);
  }
  return res.status(201).send(product);
}

module.exports = {
  create,
};
