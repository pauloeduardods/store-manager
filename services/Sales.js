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

module.exports = {
  create,
};