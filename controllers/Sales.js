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

module.exports = {
  create,
};
