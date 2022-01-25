const ProductsModel = require('../models/Products');
const ProductsSchema = require('../schemas/Products');

async function create(name, quantity) {
  const searchName = await ProductsModel.getByName(name);
  const nameValidation = ProductsSchema.nameValidation(name, searchName);
  if (nameValidation.errCode) {
    return nameValidation;
  }
  const quantityValidation = ProductsSchema.quantityValidation(quantity);
  if (quantityValidation.errCode) {
    return quantityValidation;
  }
  const id = await ProductsModel.create(name, quantity);
  return { id, name, quantity };
}

async function getAll() {
  const products = await ProductsModel.getAll();
  return products;
}

async function getById(id) {
  const product = await ProductsModel.getById(Number(id));
  const validation = ProductsSchema.thereIsAProduct(product);
  if (validation.errCode) {
    return validation;
  }
  return product;
}

async function update(id, name, quantity) {
  const nameValidation = ProductsSchema.nameValidation(name);
  if (nameValidation.errCode) {
    return nameValidation;
  }
  const quantityValidation = ProductsSchema.quantityValidation(quantity);
  if (quantityValidation.errCode) {
    return quantityValidation;
  }
  const result = await ProductsModel.update(Number(id), name, quantity);
  if (result) {
    return { id, name, quantity };
  }
  return { errCode: 404, message: 'Product not found' };
}

async function deleteById(id) {
  const currentId = await ProductsModel.getById(Number(id));
  if (!currentId.id) return { errCode: 404, message: 'Product not found' };
  const result = await ProductsModel.deleteById(Number(id));
  if (result) return currentId;
  return { errCode: 404, message: 'Product not found' };
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
