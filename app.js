const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '648889c7e711c6e3bc3ee32a',
  };

  next();
});

// app.use(require('./routes/users'));

// app.use(require('./routes/cards'));

app.use(require('./routes/index'));

app.patch('*', (req, res) => {
  const ERROR_CODE = 404;

  res.status(ERROR_CODE).send({ message: 'Рута не существует' });
});

app.listen(PORT);
