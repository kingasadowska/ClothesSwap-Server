const uuid = require('uuid/v4');

const HttpError = require('../models/HttpErrors');

let SAMPLE_CLOTHES = [
  {
    id: 'p1',
    title: 'Dress',
    description: 'short yellow',
    imageUrl: 'https://content.asos-media.com/-/media/homepages/ww/2020/05/11/ww_global_mobile-hero_1650-x-1884_4th-may.jpg',
    size: 'S',
    price: '15 $',
    location: {
      lat: 30.7387491,
      lng: -52.6871527
    },
    creator: 'u1'
  }
];

const getClothesById = (req, res, next) => {
  const clothesId = req.params.pid;

  const clothes = SAMPLE_CLOTHES.find(p => {
    return p.id === clothesId;
  });

  if (!clothes) {
    throw new HttpError('Do not found clothes with that id.', 404);
  }

  res.json({ clothes });
};

const getClothesByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const clothes = SAMPLE_CLOTHES.filter(p => {
    return p.creator === userId;
  });

  if (!clothes || clothes.length === 0) {
    return next(
      new HttpError('Do not found clothes with that id.', 404)
    );
  }

  res.json({ clothes });
};

const createClothes = (req, res, next) => {
  const { title, size, description, price, coordinates } = req.body;
  const createdClothes = {
    id: uuid(),
    title,
    size,
    price,
    description,
    location: coordinates,
    creator
  };

  SAMPLE_CLOTHES.push(createdClothes);

  res.status(201).json({ clothes: createdClothes });
};

const updateClothes = (req, res, next) => {
  const { title, description } = req.body;
  const clothesId = req.params.pid;

  const updatedClothes = { ...SAMPLE_CLOTHES.find(p => p.id === clothesId) };
  const clothesIndex = SAMPLE_CLOTHES.findIndex(p => p.id === clothesId);
  updatedClothes.title = title;
  updatedClothes.description = description;

  SAMPLE_CLOTHES[clothesIndex] = updatedClothes;

  res.status(200).json({ clothes: updatedClothes });
};

const deleteClothes = (req, res, next) => {
  const clothesId = req.params.pid;
  SAMPLE_CLOTHES = SAMPLE_CLOTHES.filter(p => p.id !== clothesId);
  res.status(200).json({ text: 'Deleted clothes.' });
};

exports.getClothesById = getClothesById;
exports.getClothesByUserId = getClothesByUserId;
exports.createClothes = createClothes;
exports.updateClothes = updateClothes;
exports.deleteClothes = deleteClothes;
