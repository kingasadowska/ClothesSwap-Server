const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const clothesRoutes = require('./routes/ClothesRoute');
const usersRoutes = require('./routes/UsersRoute');
const HttpError = require('./models/HttpErrors');

const app = express();

app.use(bodyParser.json());

app.use('/api/clothes', clothesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Check route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({text: error.text || 'Error! Not found'});
});

mongoose
  .connect('mongodb+srv://admin1:12345@cluster0-aqvmj.mongodb.net/clothes?retryWrites=true&w=majority')
  .then(() => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
