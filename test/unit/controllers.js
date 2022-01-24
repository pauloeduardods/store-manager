const { expect } = require('chai');
const sinon = require('sinon');

const ProductsService = require('../../services/Products');
const Products = require('../../controllers/Products');

describe('Controllers unit tests', () => {
  const response = {};
  const request = {};
  let next;

  before(() => {
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

  describe('Products.create', () => {
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
  });
});