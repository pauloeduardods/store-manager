const {
  blankString,
  blankQuantity,
  isInvalidNameLength,
  nameAlreadyExists,
  isValidQuantity,

} = require('./Validators');

const nameValidation = (name, searchName) => {
  switch (true) {
    case blankString(name): return { errCode: 400, message: '"name" is required' };
    case isInvalidNameLength(name): return {
      errCode: 422,
      message: '"name" length must be at least 5 characters long',
    };
    case !searchName: return true;
    case nameAlreadyExists(name, searchName): return {
      errCode: 409,
      message: 'Product already exists',
    };
    default: return false;
  }
};

const quantityValidation = (quantity) => {
  switch (true) {
    case blankQuantity(quantity): return { errCode: 400, message: '"quantity" is required' };
    case isValidQuantity(quantity): return {
      errCode: 422,
      message: '"quantity" must be a number larger than or equal to 1',
    };
    default: return false;
  }
};

const thereIsAProduct = (products) => {
  switch (true) {
    case !products || products.length <= 0: return { errCode: 404, message: 'Product not found' };
    default: return true;
  }
};

module.exports = {
  nameValidation,
  quantityValidation,
  thereIsAProduct,
};