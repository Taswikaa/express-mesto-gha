const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(require('./routes/index'));

app.patch('*', (req, res) => {
  const ERROR_CODE = 404;

  res.status(ERROR_CODE).send({ message: 'Рута не существует' });
});

app.listen(PORT);
