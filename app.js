/* eslint-disable import/no-extraneous-dependencies */
// Import Packages
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const { DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { PORT } = require('./config');

// Import Middlewares
const errors = require('./middlewares/errors');

// Import Router
const mainRouter = require('./routes/index');

mongoose.connect(DATABASE_URL);

// App
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(mainRouter);

app.use(errors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening: PORT ${PORT}`);
});
