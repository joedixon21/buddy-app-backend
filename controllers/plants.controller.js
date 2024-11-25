const { fetchAllPlants, fetchPlantById } = require("../models/plants.model");

const getAllPlantsList = (request, response, next) => {
  const searchTerm = request.query.search;

  fetchAllPlants({ searchTerm })
    .then((plants) => {
      response.status(200).json({ plants });
    })
    .catch((err) => {
      next(err);
    });
};

const getPlantById = (request, response, next) => {
  const { plant_id } = request.params;

  fetchPlantById(plant_id)
    .then((plant) => {
      response.status(200).json(plant);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getAllPlantsList, getPlantById };
