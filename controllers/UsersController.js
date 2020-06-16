const { validationResult } = require('express-validator');
const HttpError = require('../models/HttpErrors');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Can not fetch user. Please try again.',
      500
    );
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))});
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Check inputs, invalid data detected.', 422);
  }
  const { name, email, password } = req.body;

  let existingUser
  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Register failed.',
      500
    );
    return next(error);
  }
  
  if (existingUser) {
    const error = new HttpError(
      'User exists, choose other login.',
      422
    );
    return next(error);
  }
  
  const createdUser = new User({
    name,
    email,
    image: 'https://content.asos-media.com/-/media/homepages/ww/2020/05/11/ww_global_mobile-hero_1650-x-1884_4th-may.jpg',
    password,
    clothes: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Register failed.',
      500
    );
    return next(error);
  }

  res.status(201).json({user: createdUser.toObject({ getters: true })});
};

const login = async(req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email })
  } catch (err) {
    const error = new HttpError(
      'Login failed!',
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      'Failed login, check your credentials.',
      401
    );
    return next(error);
  }

  res.json(
    {message: 'Success!',
    user: existingUser.toObject({ getters: true })
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login= login;
