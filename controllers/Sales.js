const rescue = require('express-rescue');

const Sales = require('../services/Sales');

const create = rescue(async (req, res, next) => {
  const result = await Sales.create(req.body);
  if (result.errCode) {
    return next(result);
  }
  const { id, itemsSold } = result;
  return res.status(201).send({
    id,
    itemsSold,
  });
});

const getAll = rescue(async (_req, res) => {
  const sales = await Sales.getAll();
  return res.status(200).send(sales);
});

const getById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const sales = await Sales.getById(id);
  if (sales.errCode) {
    return next(sales);
  }
  return res.status(200).send(sales);
});

const update = rescue(async (req, res, next) => {
  const { id } = req.params;
  const result = await Sales.update(id, req.body);
  if (result.errCode) {
    return next(result);
  }
  const { saleId, itemUpdated } = result;
  return res.status(200).send({
    saleId,
    itemUpdated,
  });
});

const deleteById = rescue(async (req, res, next) => {
  const { id } = req.params;
  const result = await Sales.deleteById(id);
  if (result.errCode) {
    return next(result);
  }
  return res.status(200).send(result);
});

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
