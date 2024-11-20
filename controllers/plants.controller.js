const Plant = require("../models/plants.model");

exports.getAllPlantsList = (request, response, next) => {
  const plant = Plant.find({})
    .then(() => {})
    .catch((err) => {
      next(err);
    });
};
