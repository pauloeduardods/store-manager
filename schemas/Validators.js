const blankString = (name) => !name || String(name).length === 0;

const blankQuantity = (quantity) => !quantity && quantity !== 0;

const isInvalidNameLength = (name) => name.length < 5;

const nameAlreadyExists = (name, query) => query.some((product) => product.name === name);

const isValidQuantity = (quantity) => quantity < 1 || typeof quantity !== 'number';

const productIdValidator = (sales) => sales.some((sale) => !sale.productId);

const quantityValidator = (sales) => sales.some(({ quantity }) => blankQuantity(quantity));

const quantityIsValid = (sales) => sales.some((sale) => isValidQuantity(sale.quantity));

module.exports = {
  blankString,
  blankQuantity,
  isInvalidNameLength,
  nameAlreadyExists,
  isValidQuantity,
  productIdValidator,
  quantityIsValid,
  quantityValidator,
};
