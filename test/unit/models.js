const { expect } = require('chai');
const sinon = require('sinon');

const mysqlMock = require('../mocks/mysqlProducts');

const conn = require('../../models/connection');

const Products = require('../../models/Products');
const Sales = require('../../models/Sales');

describe('Models unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Products', () => {
    describe('create', () => {
      it('Should return the correct id of the inserted product', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.createMock);
        expect(await Products.create('Coca Cola', 10)).to.deep.equal(mysqlMock.createMock[0].insertId);
        sinon.assert.calledWith(conn.execute, 'INSERT INTO products (name, quantity) VALUES (?, ?)', ['Coca Cola', 10]);
      });
      it('Should return false if name or quantity is missing', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.createMock);
        expect(await Products.create('Coca Cola')).to.equal(false);
        sinon.assert.notCalled(conn.execute);
        expect(await Products.create(null, 10)).to.equal(false);
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('getByName', () => {
      it('Should return correctly product when exists', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getByNameMock);
        expect(await Products.getByName('Coca Cola')).to.deep.equal(mysqlMock.getByNameMock[0]);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE name = ?', ['Coca Cola']);
      });
      it('Should return empty array if product does not exist', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.getByName('Coca Cola')).to.deep.equal([]);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE name = ?', ['Coca Cola']);
      });
      it('Should return false if name is missing', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getByNameMock);
        expect(await Products.getByName()).to.equal(false);
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('getAll', () => {
      it('Should return the correct products in database', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getAllMock);
        expect(await Products.getAll()).to.deep.equal(mysqlMock.getAllMock[0]);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products');
      });
      it('Should return empty array if database is empty', async () => {
        sinon.stub(conn, 'execute').resolves([[]]);
        expect(await Products.getAll()).to.deep.equal([]);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products');
      });
    });

    describe('getById', () => {
      it('Should return the correct product with some id', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getByIdMock);
        expect(await Products.getById(1)).to.deep.equal(mysqlMock.getByIdMock[0][0]);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE id = ?', [1]);
      });
      it('Should return empty array if product does not exist', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.getById(1)).to.deep.equal(false);
        sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE id = ?', [1]);
      });
      it('Should return false if id is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.getById()).to.deep.equal(false);
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('update', () => {
      it('Should return true when updated', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateMock);
        expect(await Products.update(1, 'Coca Cola', 10)).to.be.true;
        sinon.assert.calledWith(conn.execute, 'UPDATE products SET name = ?, quantity = ? WHERE id = ?', ['Coca Cola', 10, 1]);
      });
      it('Should return false when not updated', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateMockFalse);
        expect(await Products.update(1, 'Coca Cola', 10)).to.be.false;
        sinon.assert.calledWith(conn.execute, 'UPDATE products SET name = ?, quantity = ? WHERE id = ?', ['Coca Cola', 10, 1]);
      });
      it('Should return false if id, name or quantity is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.update(1, 'gelo')).to.be.false;
        sinon.assert.notCalled(conn.execute);
        expect(await Products.update(1, null, 10)).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
    });
    
    describe('deleteById', () => {
      it('Should delete correctly', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.deleteMock);
        expect(await Products.deleteById(1)).to.be.true;
        sinon.assert.calledWith(conn.execute, 'DELETE FROM products WHERE id = ?', [1]);
        expect(await Products.deleteById(2)).to.be.true;
        sinon.assert.calledWith(conn.execute, 'DELETE FROM products WHERE id = ?', [2]);
      });
      it('Should return false if id is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.deleteById()).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('getQuantity', () => {
      it('Should return the correct amount of products avaliable', async() => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getQuantityMock);
        expect(await Products.getQuantity(1)).to.equal(mysqlMock.getQuantityMock[0][0].quantity);
      });
      it('Should return false if id is missing', async() => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.getQuantity()).to.equal(false);
      });
      it('Should return false if dont find any product', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.getQuantity(1)).to.equal(false);
      });
    });

    describe('updateQuantity', () => {
      it('Should return true when updated', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateQuantityMock);
        expect(await Products.updateQuantity(1, 10)).to.be.true;
        sinon.assert.calledOnce(conn.execute);
      });
      it('Should return false if quantity of id is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Products.updateQuantity(1)).to.be.false;
        sinon.assert.notCalled(conn.execute);
        expect(await Products.updateQuantity(null, 1)).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
      it('Should return false if quantity or productId is missing', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateQuantityMockFalse);
        expect(await Products.updateQuantity(1, 10)).to.be.false;
      });
    });
  });

  describe('Sales', () => {
    describe('create', () => {
      it('Should insert correctly in DB', async () => {
        const body = [
          {
            "productId": 1,
            "quantity": 2
          },
          {
            "productId": 2,
            "quantity": 5
          }
        ];
        sinon.stub(conn, 'execute').resolves(mysqlMock.createMock);
        expect(await Sales.create(body)).to.be.equal(mysqlMock.createMock[0].insertId);
      });
      it('Should return false if id, productId or quantity is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.create([{ "productId": 1 }])).to.be.false;
        sinon.assert.notCalled(conn.execute);
        expect(await Sales.create([{ "quantity": 2 }])).to.be.false;
        sinon.assert.notCalled(conn.execute);
        expect(await Sales.create([])).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
    });
    
    describe('getAll', () => {
      it('Should return the correct sales in database', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getAllMockSales);
        expect(await Sales.getAll()).to.deep.equal(mysqlMock.getAllMockSales[0]);
      });
      it('Should return empty array if database is empty', async () => {
        sinon.stub(conn, 'execute').resolves([[]]);
        expect(await Sales.getAll()).to.deep.equal([]);
      });
    });

    describe('getById', () => {
      it('Should return the correct sale with some id', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getByIdMockSales);
        expect(await Sales.getById(1)).to.deep.equal(mysqlMock.getByIdMockSales[0]);
      });
      it('Should return empty array if sale does not exist', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.getById(1)).to.deep.equal([]);
      });
      it('Should return false if id is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.getById()).to.deep.equal(false);
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('update', () => {
      it('Should return true when updated', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateMock);
        expect(await Sales.update(1, [{ productId: 1, quantity: 1}])).to.be.true;
        expect(await Sales.update(1, [{ productId: 1, quantity: 1 }, { productId: 2, quantity:100 }])).to.be.true;
      });
      it('Should return false when not updated', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.updateMockFalse);
        expect(await Sales.update(1, [{ productId: 1, quantity: 1 }])).to.be.false;
      });
      it('Should return false if id or the array of { productId, quantity } is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.update(1, [{ quantity: 1}])).to.be.false;
        sinon.assert.notCalled(conn.execute);
        expect(await Sales.update(1, [{ productId: 1 }])).to.be.false;
        expect(await Sales.update(null, [{ productId: 1, quantity: 1 }])).to.be.false;
        expect(await Sales.update(1, [])).to.be.false;
        expect(await Sales.update(1)).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
    });

    describe('deleteById', () => {
      it('Should delete correctly', async () => {
        sinon.stub(conn, 'execute').resolves(mysqlMock.getByIdMockSales);
        expect(await Sales.deleteById(1)).be.deep.equal(mysqlMock.getByIdMockSales[0]);
        expect(await Sales.deleteById(2)).be.deep.equal(mysqlMock.getByIdMockSales[0]);
      });
      it('Should return false if id is missing', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.deleteById()).to.be.false;
        sinon.assert.notCalled(conn.execute);
      });
      it('Should return false if dont find any sale with id', async () => {
        sinon.stub(conn, 'execute').resolves([[], {}]);
        expect(await Sales.deleteById(1)).to.be.false;
      });
    });
  });
});