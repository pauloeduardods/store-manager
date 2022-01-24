const { expect } = require('chai');
const sinon = require('sinon');

const mysqlMock = require('../mocks/mysqlProducts');

const conn = require('../../models/connection');

const Products = require('../../models/Products');

describe('Models unit tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Products.getAll()', () => {
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

  describe('Products.create()', () => {
    it('Should return the correct id of the inserted product', async () => {
      sinon.stub(conn, 'execute').resolves(mysqlMock.createMock);
      expect(await Products.create('Coca Cola', 10)).to.deep.equal(mysqlMock.createMock[0].insertId);
      sinon.assert.calledWith(conn.execute, 'INSERT INTO products (name, quantity) VALUES (?, ?)', ['Coca Cola', 10]);
    });
    it('Should return false if name or quantity is missing', async () => {
      sinon.stub(conn, 'execute').resolves(mysqlMock.createMock);
      expect(await Products.create('Coca Cola')).to.equal(false);
      sinon.assert.notCalled(conn.execute);
    });
  });

  describe('Products.getByName()', () => {
    it('Should return correctly product when exists', async () => {
      sinon.stub(conn, 'execute').resolves(mysqlMock.getByNameMock);
      expect(await Products.getByName('Coca Cola')).to.deep.equal(mysqlMock.getByNameMock[0]);
      sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE name = ?', ['Coca Cola']);
    });
    it('Should return empty array if product does not exist', async () => {
      sinon.stub(conn, 'execute').resolves([[],{}]);
      expect(await Products.getByName('Coca Cola')).to.deep.equal([]);
      sinon.assert.calledWith(conn.execute, 'SELECT * FROM products WHERE name = ?', ['Coca Cola']);
    });
  });
});