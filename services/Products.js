const ProductsModel = require('../models/Products');
const ProductsSchema = require('../schemas/Products');

async function create(name, quantity) {
  try {
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
  } catch (err) {
    return { errCode: 500, message: 'Internal server error' };
  }
}

module.exports = {
  create,
};
