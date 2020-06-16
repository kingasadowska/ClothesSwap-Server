const express = require('express');
const { check } = require('express-validator');
const clothesControllers = require('../controllers/ClothesController');

const router = express.Router();

router.get('/:cid', clothesControllers.getClothesById);

router.get('/user/:uid', clothesControllers.getClothesByUserId);

router.post('/', 
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
