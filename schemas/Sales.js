const {
  productIdValidator,
  quantityIsValid,
  quantityValidator,
} = require('./Validators');

const saleDataNormalize = (sales) => sales.map((sale) => ({
  productId: sale.product_id,
  quantity: sale.quantity,
}));

const saleValidator = (sales) => {
  switch (true) {
    case productIdValidator(sales): return {
      errCode: 400,
      message: '"product_id" is required',
    };
    case quantityValidator(sales): return {
      errCode: 400,
      message: '"quantity" is required',
    };
    case quantityIsValid(sales): return {
      errCode: 422,
      message: '"quantity" must be a number larger than or equal to 1',
    };
    default: return false;
  }
};

module.exports = {
  saleValidator,
  saleDataNormalize,
};
