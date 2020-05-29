const uuid = require('uuid/v4');

const HttpError = require('../models/HttpErrors');

const SAMPLE_USERS = [
  {
    id: 'u1',
    name: 'Emma White',
    email: 'emma@white.com',
    password: '12345'
  }
];

const getUsers = (req, res, next) => {
  res.json({ users: SAMPLE_USERS });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const findUser = SAMPLE_USERS.find(u => u.email === email);
  if (findUser) {
    throw new HttpError('Sorry, this email is taken, choose another one', 422);
  }

  const newUser = {
    id: uuid(),
    name,
    email,
    password
  };

  SAMPLE_USERS.push(newUser);

  res.status(201).json({user: newUser});
};

const login= (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = SAMPLE_USERS.find(u => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Wrong credentials or user do not exist.', 401);
  }

  res.json({text: 'Success!'});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login= login;
