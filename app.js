const express = require('express');
const bodyParser = require('body-parser');

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
  res.json({text: error.text || 'Error!'});
});

app.listen(5000);