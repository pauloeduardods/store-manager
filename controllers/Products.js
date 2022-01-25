const rescue = require('express-rescue');

const Products = require('../services/Products');

const create = rescue(async (req, res, next) => {
  const { name, quantity } = req.body;
  const product = await Products.create(name, quantity);
  if (product.errCode) {
    return next(product);
  }
  return res.status(201).send(product);
});

const getAll = rescue(async (_req, res) => {
  const products = await Products.getAll();
  return res.status(200).send(products);
});

const getById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const product = await Products.getById(id);
  if (product.errCode) {
    return next(product);
  }
  return res.status(200).send(product);
});

module.exports = {
  create,
  getById,
  getAll,
};
