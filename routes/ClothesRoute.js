const express = require('express');

const clothesControllers = require('../controllers/ClothesController');

const router = express.Router();

router.get('/:pid', clothesControllers.getClothesById);

router.get('/user/:uid', clothesControllers.getClothesByUserId);

router.post('/', clothesControllers.createClothes);

router.patch('/:pid', clothesControllers.updateClothes);

router.delete('/:pid', clothesControllers.deleteClothes);

module.exports = router;
