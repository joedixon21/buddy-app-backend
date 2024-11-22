const {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
  createNewJournalEntry,
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

const postUserGardenList = (request, response, next) => {
  const { user_id, garden_plant_id } = request.params;
  const journalEntry = request.body;
  createNewJournalEntry(user_id, garden_plant_id, journalEntry)
    .then((newJournalEntry) => {
      response.status(201).send({ new_entry: newJournalEntry });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserGardenByUserId,
  getUserGardenPlantByUserAndPlantId,
  postUserGardenList,
};
