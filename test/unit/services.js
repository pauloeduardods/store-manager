const { expect } = require('chai');
const sinon = require('sinon');

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
  });
  
  describe('Sales', () => {
    describe('create', () => {
      it('Should return the correct object if created', async () => {
        sinon.stub(SalesModel, 'create').resolves(10);
        const expectResult = {
          "id": 10,
          "itemsSold": [
            {
              "product_id": 1,
              "quantity": 2
            },
            {
              "product_id": 2,
              "quantity": 5
            }
          ]
        };
        expect(await Sales.create(expectResult.itemsSold)).to.deep.equal(expectResult); 
      });
      it('Should return ""product_id" is required" if product_id is missing', async () => {
        sinon.stub(SalesModel, 'create').resolves(1);
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
        expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
      });
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
      it('Should return "Dont find any product with this "product_id""', async () => {
        sinon.stub(SalesModel, 'create').resolves(false);
        const expectResult = {
          errCode: 404,
          message: 'Dont find any product with this "product_id"',
        };
        const itemsSold = [
          {
            "product_id": 1,
            "quantity": 2
          },
          {
            "product_id": 2,
            "quantity": 5
          }
        ];
        expect(await Sales.create(itemsSold)).to.deep.equal(expectResult);
        expect(await Sales.create([itemsSold[0]])).to.deep.equal(expectResult);
      });
    });
  });
});