const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
    '/signup', 
    [
        check('name')
          .not()
          .isEmpty(),
        check('email')
          .normalizeEmail()
          .isEmail(),
        check('password').isLength({ min: 5 })
    ],
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
