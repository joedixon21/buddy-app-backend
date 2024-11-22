const {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
} = require("../models/user_gardens.model");

const getUserGardenByUserId = (req, res, next) => {
  const { user_id } = req.params;

  fetchUserGardenByUserId(user_id)
    .then((userGarden) => {
      res.status(200).send({ userGarden });
    })
    .catch((err) => {
      next(err);
    });
};

const getUserGardenPlantByUserAndPlantId = (req, res, next) => {
  const { user_id, plant_id } = req.params;

  fetchUserGardenPlantByUserAndPlantId({ user_id, plant_id })
    .then((plant) => {
      res.status(200).send({ plant });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUserGardenByUserId, getUserGardenPlantByUserAndPlantId };
