const { expect } = require('chai');
const sinon = require('sinon');

const conn = require('../../models/connection');
const ProductsModel = require('../../models/Products');
const Products = require('../../services/Products');
const SalesModel = require('../../models/Sales');
const Sales = require('../../services/Sales');


describe('Services unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Products', () => {
    describe('create', () => {
      it('Should return the object with id when inserted correctly', async () => {
        const expectResult = {
          id: 1,
          name: 'Coca Cola',
          quantity: 10,
        }
        sinon.stub(ProductsModel, 'create').resolves(1);
        sinon.stub(ProductsModel, 'getByName').resolves([]);
        expect(await Products.create('Coca Cola', 10)).to.deep.equal(expectResult);
        sinon.assert.calledWith(ProductsModel.create, 'Coca Cola', 10);
      });
      it('Should return object with message: "name" is required" if called without name', async () => {
        const expectResult = {
          errCode: 400,
          message: '"name" is required',
        }
        sinon.stub(ProductsModel, 'create').resolves([]);
        sinon.stub(ProductsModel, 'getByName').resolves([]);
        expect(await Products.create('', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create()).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create(null, 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
      });
      it('Should return object with message ""name" length must be at least 5 characters long"', async () => {
        const expectResult = {
          errCode: 422,
          message: '"name" length must be at least 5 characters long',
        };
        sinon.stub(ProductsModel, 'create').resolves([]);
        sinon.stub(ProductsModel, 'getByName').resolves([]);
        expect(await Products.create('Coca', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create('Coa', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create('C', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
      });
      it('Should return object with message "Product already exists" if product already exists', async () => {
        const expectResult = {
          errCode: 409,
          message: 'Product already exists',
        };
        sinon.stub(ProductsModel, 'create').resolves([]);
        sinon.stub(ProductsModel, 'getByName').resolves([{ name: 'Coca Cola', id: 2, quantity: 10 }]);
        expect(await Products.create('Coca Cola', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
      });
      it('Should return object with message ""quantity" is required"', async () => {
        const expectResult = {
          errCode: 400,
          message: '"quantity" is required',
        };
        sinon.stub(ProductsModel, 'create').resolves([]);
        sinon.stub(ProductsModel, 'getByName').resolves([]);
        expect(await Products.create('Coca Cola')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
      });
      it('Should return object with message ""quantity" must be a number larger than or equal to 1"', async () => {
        const expectResult = {
          errCode: 422,
          message: '"quantity" must be a number larger than or equal to 1',
        };
        sinon.stub(ProductsModel, 'create').resolves([]);
        sinon.stub(ProductsModel, 'getByName').resolves([]);
        expect(await Products.create('Coca Cola', 0)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create('Coca Cola', -1)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
        expect(await Products.create('Coca Cola', 'a')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.create);
      });
    });

    describe('getAll', () => {
      it('Should return all products if exists', async () => {
        const expectResult = [
          {
            id: 1,
            name: 'Coca Cola',
            quantity: 10,
          },
          {
            id: 2,
            name: 'Fanta',
            quantity: 10,
          },
        ];
        sinon.stub(ProductsModel, 'getAll').resolves(expectResult);
        expect(await Products.getAll()).to.deep.equal(expectResult);
        sinon.assert.calledOnce(ProductsModel.getAll);
      });
      it('Should return empty array if no products', async () => {
        const expectResult = [];
        sinon.stub(ProductsModel, 'getAll').resolves([]);
        expect(await Products.getAll()).to.deep.equal(expectResult);
        sinon.assert.calledOnce(ProductsModel.getAll);
      });
    });

    describe('getById', () => {
      it('Should return just one element if exists', async () => {
        const expectResult = [
          {
            id: 1,
            name: 'Coca Cola',
            quantity: 10,
          },
        ];
        sinon.stub(ProductsModel, 'getById').resolves(expectResult);
        expect(await Products.getById(1)).to.deep.equal(expectResult);
        sinon.assert.calledOnce(ProductsModel.getById);
      });
      it('Should return "Product not found"', async () => {
        const expectResult = {
          errCode: 404,
          message: 'Product not found',
        };
        sinon.stub(ProductsModel, 'getById').resolves([]);
        expect(await Products.getById(1)).to.deep.equal(expectResult);
        sinon.assert.calledOnce(ProductsModel.getById);
      });
    });

    describe('update', () => {
      it('Should return the object with id when updated correctly', async () => {
        const expectResult = {
          id: 1,
          name: 'Coca Cola',
          quantity: 10
        };
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1, 'Coca Cola', 10)).to.deep.equal(expectResult);
        sinon.assert.calledWith(ProductsModel.update, 1, 'Coca Cola', 10);
      });
      it('Should return object with message: "name" is required" if called without name', async () => {
        const expectResult = {
          errCode: 400,
          message: '"name" is required',
        }
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(1, null, 2)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(1, null, 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
      });
      it('Should return object with message ""name" length must be at least 5 characters long"', async () => {
        const expectResult = {
          errCode: 422,
          message: '"name" length must be at least 5 characters long',
        };
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1, 'Coca', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(2, 'Coa', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(3, 'C', 10)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
      });
      it('Should return object with message ""quantity" is required"', async () => {
        const expectResult = {
          errCode: 400,
          message: '"quantity" is required',
        };
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1, 'Coca Cola')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(2, 'Coca Cola', null)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(2, 'Coca Cola')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
      });
      it('Should return object with message ""quantity" must be a number larger than or equal to 1"', async () => {
        const expectResult = {
          errCode: 422,
          message: '"quantity" must be a number larger than or equal to 1',
        };
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1, 'Coca Cola', 0)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(2, 'Coca Cola', -1)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(3, 'Coca Cola', 'a')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
      });
      it('Should return object with message ""quantity" must be a number larger than or equal to 1"', async () => {
        const expectResult = {
          errCode: 422,
          message: '"quantity" must be a number larger than or equal to 1',
        };
        sinon.stub(ProductsModel, 'update').resolves(true);
        expect(await Products.update(1, 'Coca Cola', 0)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(2, 'Coca Cola', -1)).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
        expect(await Products.update(3, 'Coca Cola', 'a')).to.deep.equal(expectResult);
        sinon.assert.notCalled(ProductsModel.update);
      });
      it('Should return object with message "Product not found"', async () => {
        const expectResult = {
          errCode: 404,
          message: 'Product not found',
        };
        sinon.stub(ProductsModel, 'update').resolves(false);
        expect(await Products.update(1, 'Coca Cola', 10)).to.deep.equal(expectResult);
        expect(await Products.update(2, 'Geloo', 2)).to.deep.equal(expectResult);
      });
    });
    
    describe('deleteById', () => {
      it('Should return the object deleted', async () => {
        const expectResult = {
          id: 1,
          name: 'Coca Cola',
          quantity: 10
        };
        sinon.stub(ProductsModel, 'getById').resolves(expectResult);
        sinon.stub(ProductsModel, 'deleteById').resolves(true);
        expect(await Products.deleteById(1)).to.deep.equal(expectResult);
        sinon.assert.calledOnce(ProductsModel.deleteById);
      });
      it('Should return object with message "Product not found"', async () => {
        const expectResult = {
          errCode: 404,
          message: 'Product not found',
        };
        sinon.stub(ProductsModel, 'getById').resolves(false);
        sinon.stub(ProductsModel, 'deleteById').resolves(false);
        expect(await Products.deleteById(1)).to.deep.equal(expectResult);
        expect(await Products.deleteById(2)).to.deep.equal(expectResult);
      });
      it('Should return object with message "Product not found" if query fails', async () => {
        const geyById = {
          id: 1,
          name: 'Coca Cola',
          quantity: 10
        };
        const expectResult = {
          errCode: 404,
          message: 'Product not found',
        };
        sinon.stub(ProductsModel, 'getById').resolves(geyById);
        sinon.stub(ProductsModel, 'deleteById').resolves(false);
        expect(await Products.deleteById(1)).to.deep.equal(expectResult);
        expect(await Products.deleteById(2)).to.deep.equal(expectResult);
      });
    });

    describe('updateQuantity', () => {
      it('Should return true if update correctly', async () => {
        sinon.stub(ProductsModel, 'updateQuantity').resolves(true);
        expect(await Products.updateQuantity([{ productId: 10, quantity: 1}])).to.be.true;
        sinon.assert.calledOnce(ProductsModel.updateQuantity);
        sinon.assert.calledWith(ProductsModel.updateQuantity, 10, 1);
        expect(await Products.updateQuantity([{ productId: 10, quantity: 1 }, { productId: 11, quantity: 2 }])).to.be.true;
        sinon.assert.calledThrice(ProductsModel.updateQuantity);
      });
    });
  });
  
  describe('Sales', () => {
    describe('create', () => {
      // it('Should return the correct object if created', async () => {
      //   sinon.stub(SalesModel, 'create').resolves(10);
      //   sinon.stub(Sales, 'createUpdateQuantity').resolves({ productId: 10, quantity: 1 });
      //   const expectResult = {
      //     "id": 10,
      //     "itemsSold": [
      //       {
      //         "product_id": 1,
      //         "quantity": 2
      //       },
      //       {
      //         "product_id": 2,
      //         "quantity": 5
      //       }
      //     ]
      //   };
      //   expect(await Sales.create(expectResult.itemsSold)).to.deep.equal(expectResult); 
      // });
      // it('Should return ""product_id" is required" if product_id is missing', async () => {
      //   sinon.stub(SalesModel, 'create').resolves(1);
      //   const expectResult = {
      //     errCode: 400,
      //     message: '"product_id" is required',
      //   };
      //   const itemsSold = [
      //     {
      //       "quantity": 2
      //     },
      //     {
      //       "product_id": 2,
      //       "quantity": 5
      //     }
      //   ];
      //   expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
      //   expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
      // });
      it('Should return ""quantity" is required" if quantity is missing', async () => {
        sinon.stub(SalesModel, 'create').resolves(10);
        const expectResult = {
          errCode: 400,
          message: '"quantity" is required',
        };
        const itemsSold = [
          {
            "product_id": 1,
          },
          {
            "product_id": 2,
            "quantity": 5
          }
        ];
        expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
      });
      it('Should return ""quantity" must be a number larger than or equal to 1"', async () => {
        sinon.stub(SalesModel, 'create').resolves(10);
        const expectResult = {
          errCode: 422,
          message: '"quantity" must be a number larger than or equal to 1',
        };
        const itemsSold = [
          {
            "product_id": 1,
            "quantity": 0
          },
          {
            "product_id": 2,
            "quantity": -1,
          },
          {
            "product_id": 3,
            "quantity": 'a',
          },
          {
            "product_id": 3,
            "quantity": 2,
          }
        ];
        expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[1]])).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[2]])).to.deep.equal(expectResult);
      });
      // it('Should return "Dont find any product with this "product_id""', async () => {
      //   sinon.stub(SalesModel, 'create').resolves(false);
      //   const expectResult = {
      //     errCode: 404,
      //     message: 'Dont find any product with this "product_id"',
      //   };
      //   const itemsSold = [
      //     {
      //       "product_id": 1,
      //       "quantity": 2
      //     },
      //     {
      //       "product_id": 2,
      //       "quantity": 5
      //     }
      //   ];
      //   expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
      //   expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
      // });
    });

    describe('getAll', () => {
      it('Should return the correct object', async () => {
        const expectResult = [
          {
            "saleId": 1,
            "date": "2021-09-09T04:54:29.000Z",
            "product_id": 1,
            "quantity": 2
          },
          {
            "saleId": 1,
            "date": "2021-09-09T04:54:54.000Z",
            "product_id": 2,
            "quantity": 2
          }
        ];
        sinon.stub(SalesModel, 'getAll').resolves(expectResult);
        expect(await Sales.getAll()).to.deep.equal(expectResult);
      });
      it('Should return empty array if no data', async () => {
        sinon.stub(SalesModel, 'getAll').resolves([]);
        expect(await Sales.getAll()).to.deep.equal([]);
      });
    });

    describe('getById', () => {
      it('Should return the correct object if found', async () => {
        const expectResult = [
          {
            product_id: 1,
            quantity: 2,
            date: "2022-01-26T11:41:04.000Z"
          },
          {
            product_id: 1,
            quantity: 2,
            date: "2022-01-26T11:41:04.000Z"
          }
        ]
        sinon.stub(SalesModel, 'getById').resolves(expectResult);
        expect(await Sales.getById(1)).to.deep.equal(expectResult);
      });
      it('Should return object with message "Sale not found"', async () => {
        const expectResult = {
          errCode: 404,
          message: 'Sale not found',
        };
        sinon.stub(SalesModel, 'getById').resolves(false);
        expect(await Sales.getById(1)).to.deep.equal(expectResult);
        sinon.restore();
        sinon.stub(SalesModel, 'getById').resolves([]);
        expect(await Sales.getById(2)).to.deep.equal(expectResult);
      });
    });
    describe('update', () => {
      // it('Should return the correct object if updated', async () => {
      //   const expectResult = {
      //     "saleId": 1,
      //     "itemUpdated": [
      //       {
      //         "product_id": 1,
      //         "quantity": 6
      //       }
      //     ]
      //   } ;
      //   sinon.stub(SalesModel, 'update').resolves(true);
      //   expect(await Sales.update(1, [{ product_id: 1, quantity: 6 }])).to.deep.equal(expectResult);
      // });
      it('Should return ""product_id" is required" if product_id is missing', async () => {
        const expectResult = {
          errCode: 400,
          message: '"product_id" is required',
        };
        const itemsSold = [
          {
            "quantity": 2
          },
          {
            "product_id": 2,
            "quantity": 5
          }
        ];
        sinon.stub(SalesModel, 'update').resolves(expectResult);
        expect(await Sales.update(1, itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.update(1, [itemsSold[0]])).to.deep.equal(expectResult);
      });
      it('Should return ""quantity" is required" if quantity is missing', async () => {
        const expectResult = {
          errCode: 400,
          message: '"quantity" is required',
        };
        const itemsSold = [
          {
            "product_id": 1,
          },
          {
            "product_id": 2,
            "quantity": 5
          }
        ];
        sinon.stub(SalesModel, 'update').resolves(expectResult);
        expect(await Sales.update(1, itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.update(1, [itemsSold[0]])).to.deep.equal(expectResult);
      });
      // it('Should return "Sale not found" if model update return false', async () => {
      //   const expectResult = {
      //     errCode: 404,
      //     message: 'Sale not found',
      //   };
      //   const itemsSold = [
      //     {
      //       "product_id": 1,
      //       "quantity": 2
      //     },
      //     {
      //       "product_id": 2,
      //       "quantity": 5
      //     }
      //   ];
      //   sinon.stub(SalesModel, 'update').resolves(false);
      //   expect(await Sales.update(1, itemsSold)).to.deep.equal(expectResult);
      //   expect(await Sales.update(1, [itemsSold[0]])).to.deep.equal(expectResult);
      // });
    });

    // describe('deleteById', () => {
    //   it('Should return the correct object if deleted', async () => {
    //     const expectResult = [
    //       {
    //         product_id: 1,
    //         quantity: 2,
    //         date: "2022-01-26T11:41:04.000Z"
    //       },
    //       {
    //         product_id: 1,
    //         quantity: 2,
    //         date: "2022-01-26T11:41:04.000Z"
    //       }
    //     ]
    //     sinon.stub(SalesModel, 'deleteById').resolves(expectResult);
    //     expect(await Sales.deleteById(1)).to.deep.equal(expectResult);
    //   });
      // it('Should return "Sale not found" if model update return false', async () => {
      //   const expectResult = {
      //     errCode: 404,
      //     message: 'Sale not found',
      //   };
      //   sinon.stub(SalesModel, 'deleteById').resolves(false);
      //   expect(await Sales.deleteById(1)).to.deep.equal(expectResult);
      //   expect(await Sales.deleteById(1)).to.deep.equal(expectResult);
      // });
    // });
  });
});