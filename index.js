const express = require('express');
const bodyParser = require('body-parser');

const Products = require('./controllers/Products');

const { errorMiddleware } = require('./middlewares/errorMiddleware');

require('dotenv').config();

const app = express();

app.use(bodyParser.json());

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.post('/products', Products.create);

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
