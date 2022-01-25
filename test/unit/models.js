const { expect } = require('chai');
const sinon = require('sinon');

const mysqlMock = require('../mocks/mysqlProducts');

const conn = require('../../models/connection');

const Products = require('../../models/Products');

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
      it('Should return false if id or name or quantity is missing', async () => {
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
  });
});