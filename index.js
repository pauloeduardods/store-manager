const express = require('express');
const bodyParser = require('body-parser');

const Products = require('./controllers/Products');
const Sales = require('./controllers/Sales');

const { errorMiddleware } = require('./middlewares/errorMiddleware');

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '/';

const server = express();

const app = express.Router();

app.use(bodyParser.json());

app.get('/', (_request, response) => {
  response.send();
});

app.get('/products', Products.getAll);

app.post('/products', Products.create);

app.get('/products/:id', Products.getById);

app.put('/products/:id', Products.update);

app.delete('/products/:id', Products.deleteById);

app.post('/sales', Sales.create);

app.use(errorMiddleware);

server.use(HOST, app);

server.listen(PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
