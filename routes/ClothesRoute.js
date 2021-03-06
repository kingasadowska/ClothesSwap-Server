const express = require('express');
const { check } = require('express-validator');
const clothesControllers = require('../controllers/ClothesController');
const uploadFile = require('../middleware/UploadFile');
const checkAuth = require('../middleware/CheckAuth');
const router = express.Router();

router.get('/:cid', clothesControllers.getClothesById);

router.get('/user/:uid', clothesControllers.getClothesByUserId);

router.use(checkAuth);

router.post(
  '/',
  uploadFile.single('image'),
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 6 }),
    check('size')
      .not()
      .isEmpty(),
    check('price')
      .not()
      .isEmpty(),
    check('address')
      .not()
      .isEmpty()
  ],
 clothesControllers.createClothes
);

router.patch(
    '/:cid', 
    [
        check('title')
          .not()
          .isEmpty(),
        check('description').isLength({ min: 6 }),
        check('size')
        .not()
        .isEmpty(),
        check('price')
        .not()
        .isEmpty(),
    ],
    clothesControllers.updateClothes
);

router.delete('/:cid', clothesControllers.deleteClothes);

module.exports = router;
