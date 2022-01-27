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

async function update(id, sales) {
  const saleDataNormalize = SalesValidation.saleDataNormalize(sales);
  const validation = SalesValidation.saleValidator(saleDataNormalize);
  if (validation.errCode) {
    return validation;
  }
  const result = await Sales.update(id, saleDataNormalize);
  if (!result) {
    return { errCode: 404, message: 'Sale not found' };
  }
  return {
    saleId: id,
    itemUpdated: [
      ...sales,
    ],
  };
}

async function deleteById(id) {
  const result = await Sales.deleteById(id);
  if (!result) {
    return { errCode: 404, message: 'Sale not found' };
  }
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};