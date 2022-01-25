const { expect } = require('chai');
const sinon = require('sinon');

const ProductsModel = require('../../models/Products');
const Products = require('../../services/Products');


describe('Services unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Products.create()', () => {
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
      sinon.stub(ProductsModel, 'getByName').resolves([{name: 'Coca Cola', id: 2, quantity: 10}]);
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

  describe('Products.getAll', () => {
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

  describe('Products.getById', () => {
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
});