const express = require('express');
const mongoose = require('mongoose');

const { DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { PORT, STATUS_NOT_FOUND } = require('./config');

mongoose.connect(DATABASE_URL);

const app = express();

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6446d8595c2d374a127869d8'
  };

  next();
});
app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res
    .status(STATUS_NOT_FOUND)
    .send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening: PORT ${PORT}`);
});
