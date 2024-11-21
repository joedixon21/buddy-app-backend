const { fetchAllPlants } = require("../models/plants.model");

const getAllPlantsList = (request, response, next) => {
  fetchAllPlants()
    .then((plants) => {
      response.status(200).json(plants);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { getAllPlantsList };
