const fs = require('fs');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/HttpErrors');
const getCoordination = require('../util/location');
const Clothes = require('../models/clothes');
const User = require('../models/user');

const getClothesById = async (req, res, next) => {
  const clothesId = req.params.cid;

  let clothe;
  try {
    clothe = await Clothes.findById(clothesId);
  } catch (err) {
    const error = new HttpError(
      'Not found clothes.',
      500
    );
    return next(error);
  }

  if (!clothe) {
    const error = new HttpError(
      'Not found clothes with that id.',
      404
    );
    return next(error);
  }

  res.json({ clothe: clothe.toObject({ getters: true }) }); 
};


const getClothesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithClothes;
  try {
    userWithClothes = await User.findById(userId).populate('clothes');
  } catch (err) {
    const error = new HttpError(
      'Fetching clothes failed.',
      500
    );
    return next(error);
  }

  if (!userWithClothes || userWithClothes.clothes.length === 0) {
    return next(
      new HttpError('Not found clothes fo that user id.',404)
    );
  }

  res.json({ clothes: userWithClothes.clothes.map(clothe => clothe.toObject({ getters: true })) });
};

const createClothes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
    new HttpError('Something is wrong, check inputs.', 422));
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
    image: req.file.path,
    size,
    price,
    location: coordinates,
    address,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError('Adding clothes failed..', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Can not find user with this id.', 404);
    return next(error);
  }

  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdClothes.save({ session: sess });
    user.clothes.push(createdClothes);
    await user.save({ session: sess });
    await sess.commitTransaction();
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
      return next(
        new HttpError('Something is wrong, check inputs.', 422)
      );
    }

    const { title, description, size, price } = req.body;
    const clothesId = req.params.cid;

    let clothe;
    try {
      clothe = await Clothes.findById(clothesId);
    } catch (err) {
      const error = new HttpError(
        'Could not update clothes.',
        500
      );
      return next(error);
    }

    clothe.title = title;
    clothe.description = description;
    clothe.size = size;
    clothe.price = price;

    try {
      await clothe.save();
    } catch (err) {
      const error = new HttpError(
        'Could not update clothes.',
        500
      );
      return next(error);
    }
    res.status(200).json({ clothe: clothe.toObject({ getters: true }) });
  };

  const deleteClothes = async (req, res, next) => {
    const clothesId = req.params.cid;
    
    let clothe;
    try {
      clothe = await Clothes.findById(clothesId).populate('creator');
    } catch (err) {
      const error = new HttpError(
        'Could not delete clothes.',
        500
      );
      return next(error);
    }

    if (!clothe) {
      const error = new HttpError('Do not see clothes with this id.', 404);
      return next(error);
    }

    const imagePath = place.image;

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await clothe.remove({ session: sess });
      clothe.creator.clothes.pull(clothe);
      await clothe.creator.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError(
        'Could not delete clothes.',
        500
      );
      return next(error);
    }

    fs.unlink(imagePath, err => {
      console.log(err);
    });

    res.status(200).json({ message: 'Deleted clothes!' });
  };

  exports.getClothesById = getClothesById;
  exports.getClothesByUserId = getClothesByUserId;
  exports.createClothes = createClothes;
  exports.updateClothes = updateClothes;
  exports.deleteClothes = deleteClothes;
