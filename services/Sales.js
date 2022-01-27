const Sales = require('../models/Sales');
const SalesValidation = require('../schemas/Sales');
const Validators = require('../schemas/Validators');

const Products = require('./Products');
const ProductsModel = require('../models/Products');

async function createUpdateQuantity(sales) {
  const total = await Promise.all(sales.map(async (sale) => ({
    productId: sale.product_id || sale.productId,
    quantity: (await ProductsModel.getQuantity(sale.productId
      || sale.product_id) - sale.quantity),
  })));
  return Validators.productQuantityValidator(total)
    ? { errCode: 422, message: 'Such amount is not permitted to sell' }
    : Products.updateQuantity(total, 'create');
}

async function deleteUpdateQuantity(sales) {
  const total = await Promise.all(sales.map(async (sale) => ({
    productId: sale.product_id || sale.productId,
    quantity: (await ProductsModel.getQuantity(sale.productId || sale.product_id)
      + sale.quantity),
  })));
  return Validators.deleteQuantityValidator(total)
    ? { errCode: 422, message: 'Such amount is not permitted to sell' }
    : Products.updateQuantity(total, 'delete');
}

async function getById(id) {
  const sales = await Sales.getById(id);
  if (!sales || sales.length === 0) {
    return { errCode: 404, message: 'Sale not found' };
  }
  return sales;
}

async function updateUpdateQuantity(id, sales) {
  const oldSales = await getById(id);
  const saleDataNormalize = SalesValidation.saleDataNormalize(oldSales);
  deleteUpdateQuantity(saleDataNormalize);
  const updatedQuantityResult = await createUpdateQuantity(sales);
  return updatedQuantityResult;
}

async function create(sales) {
  const saleDataNormalize = SalesValidation.saleDataNormalize(sales);
  const validation = SalesValidation.saleValidator(saleDataNormalize);
  if (validation.errCode) return validation;
  const quantityUpdateResult = await createUpdateQuantity(saleDataNormalize);
  if (quantityUpdateResult.errCode) return quantityUpdateResult;
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

async function update(id, sales) {
  const saleDataNormalize = SalesValidation.saleDataNormalize(sales);
  const validation = SalesValidation.saleValidator(saleDataNormalize);
  if (validation.errCode) {
    return validation;
  }
  const quantityUpdateResult = await updateUpdateQuantity(id, saleDataNormalize);
  if (quantityUpdateResult.errCode) return quantityUpdateResult;
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
  const sales = await Sales.getById(id);
  const result = await Sales.deleteById(id);
  const saleDataNormalize = SalesValidation.saleDataNormalize(sales);
  if (!result) {
    return { errCode: 404, message: 'Sale not found' };
  }
  const quantityUpdateResult = await deleteUpdateQuantity(saleDataNormalize);
  if (quantityUpdateResult.errCode) return quantityUpdateResult;
  return result;
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
  createUpdateQuantity,
  deleteUpdateQuantity,
  updateUpdateQuantity,
};