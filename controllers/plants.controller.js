const { fetchAllPlantsList } = require("../models/plants.model");

exports.getAllPlantsList = (request, response, next) => {
  fetchAllPlantsList()
    .then(() => {})
    .catch((err) => {
      next(err);
    });
};
