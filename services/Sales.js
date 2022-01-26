const Sales = require('../models/Sales');
const SalesValidation = require('../schemas/Sales');

async function create(sales) {
  const saleDataNormalize = SalesValidation.saleDataNormalize(sales);
  const validation = SalesValidation.saleValidator(saleDataNormalize);
  if (validation.errCode) {
    return validation;
  }
  const saleId = await Sales.create(saleDataNormalize);
  if (!saleId) {
    return { errCode: 404, message: 'Dont find any product with this "product_id"' };
  }
  return {
    id: saleId,
    itemsSold: [
      ...sales,
    ],
  };
}

async function getAll() {
  return Sales.getAll();
}

async function getById(id) {
  const sales = await Sales.getById(id);
  if (!sales || sales.length === 0) {
    return { errCode: 404, message: 'Sale not found' };
  }
  return sales;
}

module.exports = {
  create,
  getAll,
  getById,
};