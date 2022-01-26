const { expect } = require('chai');
const sinon = require('sinon');

const ProductsModel = require('../../models/Products');
const ProductsService = require('../../services/Products');
const Products = require('../../controllers/Products');

const Sales = require('../../controllers/Sales');
const SalesService = require('../../services/Sales');
const SalesModel = require('../../models/Sales');

describe('Controllers unit tests', () => {
  const response = {};
  const request = {};
  let next;

  beforeEach(() => {
    request.body = {};

    response.status = sinon.stub()
      .returns(response);
    response.send = sinon.stub()
      .returns();
    next = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Products', () => {
    describe('create', () => {
      it('Should return 201 with { "id": 1, "name": "produto", "quantity": 10 }', async () => {
        sinon.stub(ProductsService, 'create').resolves({ id: 1, name: 'produto', quantity: 10 });
        request.body = { name: 'produto', quantity: 10 };
        await Products.create(request, response, next);
        expect(response.status.calledWith(201)).to.be.true;
        expect(response.send.calledWith({ id: 1, name: 'produto', quantity: 10 })).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should return errors on next', async () => {
        sinon.stub(ProductsService, 'create').resolves({ message: 'error', errCode: 400 });
        request.body = { name: 'produto', quantity: 10 };
        await Products.create(request, response, next);
        expect(next.calledWith({ message: 'error', errCode: 400 })).to.be.true;
        sinon.assert.calledOnce(next);
      });
      it('Should return call next if query fails', async () => {
        sinon.stub(ProductsModel, 'create').rejects([]);
        request.body = { name: 'produto', quantity: 10 };
        await Products.create(request, response, next);
        sinon.assert.calledOnce(next);
      });
    });

    describe('getAll', () => {
      it('Should return 200 with correct products in database if exists', async () => {
        sinon.stub(ProductsService, 'getAll').resolves([{ id: 1, name: 'produto', quantity: 10 }, { id: 2, name: 'produto2', quantity: 20 }]);
        await Products.getAll(request, response, next);
        expect(response.status.calledWith(200)).to.be.true;
        expect(response.send.calledWith([{ id: 1, name: 'produto', quantity: 10 }, { id: 2, name: 'produto2', quantity: 20 }])).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should return 200 with correct products in database if dont exists', async () => {
        sinon.stub(ProductsService, 'getAll').resolves([]);
        await Products.getAll(request, response, next);
        expect(response.status.calledWith(200)).to.be.true;
        expect(response.send.calledWith([])).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should return call next if query fails', async () => {
        sinon.stub(ProductsModel, 'getAll').rejects([]);
        request.body = { name: 'produto', quantity: 10 };
        await Products.create(request, response, next);
        sinon.assert.calledOnce(next);
      });
    });

    describe('getById', () => {
      it('Should return 200 with correct product that have id = 1', async () => {
        sinon.stub(ProductsService, 'getById').resolves({ id: 1, name: 'produto', quantity: 10 });
        request.params = { id: 1 };
        await Products.getById(request, response, next)
        expect(response.status.calledWith(200)).to.be.true;
        expect(response.send.calledWith({ id: 1, name: 'produto', quantity: 10 })).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should return 404 if product dont exists', async () => {
        sinon.stub(ProductsService, 'getById').resolves({ message: 'Product not found', errCode: 404 });
        request.params = { id: 1 };
        await Products.getById(request, response, next)
        sinon.assert.calledOnce(next);
        sinon.assert.calledWith(next, { message: 'Product not found', errCode: 404 });
      });
      it('Should return call next if query fails', async () => {
        sinon.stub(ProductsModel, 'getById').rejects([]);
        request.body = { name: 'produto', quantity: 10 };
        await Products.create(request, response, next);
        sinon.assert.calledOnce(next);
      });
    });

    describe('update', () => {
      it('Should return 200 with updated product', async () => {
        sinon.stub(ProductsService, 'update').resolves({ id: 1, name: 'produto', quantity: 10 });
        request.params = { id: 1 };
        await Products.update(request, response, next)
        expect(response.status.calledWith(200)).to.be.true;
        expect(response.send.calledWith({ id: 1, name: 'produto', quantity: 10 })).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should call next if error', async () => {
        sinon.stub(ProductsService, 'update').resolves({ message: 'Product not found', errCode: 404 });
        request.params = { id: 1 };
        await Products.update(request, response, next);
        sinon.assert.calledOnce(next);
        await Products.update(request, response, next);
        sinon.assert.calledTwice(next);
      });
    });

    describe('deleteById', () => {
      it('Should return 200 with deleted product', async () => {
        sinon.stub(ProductsService, 'deleteById').resolves({ id: 1, name: 'produto', quantity: 10 });
        request.params = { id: 1 };
        await Products.deleteById(request, response, next)
        expect(response.status.calledWith(200)).to.be.true;
        expect(response.send.calledWith({ id: 1, name: 'produto', quantity: 10 })).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should call next if error', async () => {
        sinon.stub(ProductsService, 'deleteById').resolves({ message: 'Product not found', errCode: 404 });
        request.params = { id: 1 };
        await Products.deleteById(request, response, next);
        sinon.assert.calledOnce(next);
        await Products.deleteById(request, response, next);
        sinon.assert.calledTwice(next);
      });
    });
  });

  describe('Sales', () => {
    describe('create', () => {
      it('Should return 201 with created sale', async () => {
        const result = {
          id: 1,
          itemsSold: [
            {
              "product_id": 1,
              "quantity": 10,
            }
          ],
        }
        sinon.stub(SalesService, 'create').resolves(result);
        request.body = [ { product_id: 1, quantity: 10 } ];
        await Sales.create(request, response, next)
        expect(response.status.calledWith(201)).to.be.true;
        expect(response.send.calledWith(result)).to.be.true;
        sinon.assert.notCalled(next);
      });
      it('Should return errors on next', async () => {
        sinon.stub(SalesService, 'create').resolves({ message: 'error', errCode: 400 });
        request.body = { product_id: 1, quantity: 10 };
        await Sales.create(request, response, next);
        expect(next.calledWith({ message: 'error', errCode: 400 })).to.be.true;
        sinon.assert.calledOnce(next);
      });
      it('Should return call next if query fails', async () => {
        sinon.stub(SalesModel, 'create').rejects([]);
        request.body = { product_id: 1, quantity: 10 };
        await Sales.create(request, response, next);
        sinon.assert.calledOnce(next);
      });
    });
  });
});