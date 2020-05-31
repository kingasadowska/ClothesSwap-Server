const uuid = require('uuid/v4');
const { validationResult } = require('express-validator');

const HttpError = require('../models/HttpErrors');
const getCoordination = require('../util/location');

let SAMPLE_CLOTHES = [
  {
    id: 'c1',
    title: 'Dress',
    description: 'short yellow',
    imageUrl: 'https://content.asos-media.com/-/media/homepages/ww/2020/05/11/ww_global_mobile-hero_1650-x-1884_4th-may.jpg',
    size: 'S',
    price: '15 $',
    location: {
      lat: 30.7387491,
      lng: -52.6871527
    },
    creator: 'u1',
    address: '40th St, Boston, NY 20300'
  }
];

const getClothesById = (req, res, next) => {
  const clothesId = req.params.cid;

  const clothes = SAMPLE_CLOTHES.find(c=> {
    return c.id === clothesId;
  });

  if (!clothes) {
    throw new HttpError('Do not found clothes with that id.', 404);
  }

  res.json({ clothes });
};

const getClothesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const clothes = SAMPLE_CLOTHES.filter(c=> {
    return c.creator === userId;
  });

  if (!clothes || clothes.length === 0) {
    return next(
      new HttpError('Do not found clothes with that id.', 404)
    );
  }

  res.json({ clothes });
};

const createClothes = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError('Check inputs, Invalid data detected.', 422));
  }

  const { title, description, imageUrl, size, price, creator, address } = req.body;
 
  let coordinates;
  try {
    coordinates = await getCoordination(address);
  } catch (error) {
    return next(error);
  }
  
  const createdClothes = {
    id: uuid(),
    title,
    description,
    imageUrl,
    size,
    price,
    location: coordinates,
    creator,
    address
  };

  SAMPLE_CLOTHES.push(createdClothes);

  res.status(201).json({ clothes: createdClothes });
};

const updateClothes = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, size } = req.body;
  const clothesId = req.params.cid;

  const updatedClothes = { ...SAMPLE_CLOTHES.find(c=>c.id === clothesId) };
  const clothesIndex = SAMPLE_CLOTHES.findIndex(c=>c.id === clothesId);
  updatedClothes.title = title;
  updatedClothes.description = description;
  updatedClothes.size = size;

  SAMPLE_CLOTHES[clothesIndex] = updatedClothes;

  res.status(200).json({ clothes: updatedClothes });
};

const deleteClothes = (req, res, next) => {
  const clothesId = req.params.c.id;
  if (!SAMPLE_CLOTHES.find(c => c.id === clothesId)) {
    throw new HttpError('Could not find a clothes for that id.', 404);
  }
  SAMPLE_CLOTHES = SAMPLE_CLOTHES.filter(c =>c.id !== clothesId);
  res.status(200).json({ text: 'Deleted clothes.' });
};

exports.getClothesById = getClothesById;
exports.getClothesByUserId = getClothesByUserId;
exports.createClothes = createClothes;
exports.updateClothes = updateClothes;
exports.deleteClothes = deleteClothes;
