const express = require('express');
const { check } = require('express-validator');
const uploadFile = require('../middleware/UploadFile');
const usersController = require('../controllers/UsersController');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post(
    '/signup', 
    uploadFile.single('image'),
    [
        check('name')
          .not()
          .isEmpty(),
        check('email')
          .normalizeEmail()
          .isEmail(),
        check('password').isLength({ min: 6 })
    ],
    usersController.signup
);

router.post('/login', usersController.login);

module.exports = router;
