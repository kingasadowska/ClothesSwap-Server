const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrors');
const getCoordination = require('../util/location');
const Clothes = require('../models/clothes');

let SAMPLE_CLOTHES = [
  {
    id: 'c1',
    title: 'Dress',
    description: 'short yellow',
    size: 'S',
    price: '15',
    location: {
      lat: 30.7387491,
      lng: -52.6871527
    },
    address: '40th St, Boston, NY 20300',
    creator: 'u1',
  }
];

const getClothesById = async (req, res, next) => {
  const clothesId = req.params.cid;

  let clothes;
  try {
    clothes = await Clothes.findById(clothesId);
  } catch (err) {
    const error = new HttpError(
      'Not found clothes.',
      500
    );
    return next(error);
  }

  if (!clothes) {
    const error = new HttpError(
      'Not found clothes with that id.',
      404
    );
    return next(error);
  }

  res.json({ clothes: clothes.toObject({ getters: true }) }); 
};


const getClothesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let clothes;
  try {
    clothes = await Clothes.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Fetching clothes failed.',
      500
    );
    return next(error);
  }

  if (!clothes || clothes.length === 0) {
    const error = new HttpError(
      'Not found clothes fo that user id.',
      404
    );
    return next(error);
  }

  res.json({ clothes: clothes.map(clothes => clothes.toObject({ getters: true })) });
};

const createClothes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
    new HttpError('Invalid data, please check inputs.', 422));
  }

  const { title, description, size, price, creator, address } = req.body;
 
  let coordinates;
  try {
    coordinates = await getCoordination(address);
  } catch (error) {
    return next(error);
  }
  
  const createdClothes = new Clothes({
    title,
    description,
    imageUrl: 'https://content.asos-media.com/-/media/homepages/ww/2020/05/11/ww_global_mobile-hero_1650-x-1884_4th-may.jpg',
    size,
    price,
    location: coordinates,
    address,
    creator
  });

 try {
   await createdClothes.save();
 } catch (err) {
   const error = new HttpError(
     'Creating clothes failed!', 500
     );
     return next(error);
 }

  res.status(201).json({ clothes: createdClothes });
};

const updateClothes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid data, please check inputs.', 422);
  }

  const { title, description, size } = req.body;
  const clothesId = req.params.cid;

  let clothes;
  try {
    clothes = await Clothes.findById(clothesId);
  } catch (err) {
    const error = new HttpError(
      'Could not update clothes.',
      500
    );
    return next(error);
  }

  clothes.title = title;
  clothes.description = description;

  try {
    await clothes.save();
  } catch (err) {
    const error = new HttpError(
      'Could not update clothes.',
      500
    );
    return next(error);
  }
  res.status(200).json({ clothes: clothes.toObject({ getters: true }) });
};

const deleteClothes = async (req, res, next) => {
  const clothesId = req.params.c.id;
  
  let clothes;
  try {
    clothes = await Clothes.findById(clothesId);
  } catch (err) {
    const error = new HttpError(
      'Could not delete clothes.',
      500
    );
    return next(error);
  }

  try {
    await clothes.remove();
  } catch (err) {
    const error = new HttpError(
      'Could not delete clothes.',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted clothes!' });
};

exports.getClothesById = getClothesById;
exports.getClothesByUserId = getClothesByUserId;
exports.createClothes = createClothes;
exports.updateClothes = updateClothes;
exports.deleteClothes = deleteClothes;
