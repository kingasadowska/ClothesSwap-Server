const axios = require('axios');

const HttpError = require('../models/HttpErrors');

const API_KEY = process.env.GOOGLE_API_KEY;

async function getCoordination(address) {
  const response =  await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === 'NO_RESULTS') {
    const error = new HttpError(
      'Location do not found.',
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordination;
