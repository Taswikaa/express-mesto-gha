const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '648889c7e711c6e3bc3ee32a',
  };

  next();
});

app.use(require('./routes/users'));

app.use(require('./routes/cards'));

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT);
