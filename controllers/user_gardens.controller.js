const {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
  createNewJournalEntry,
  updateJournalTextByUserAndPlantAndJournalId,
  removeUserGardenPlant,
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

const patchJournalTextByUserAndPlantAndJournalId = (req, res, next) => {
  const { user_id, garden_plant_id, journal_entry_id } = req.params;
  const textToUpdate = req.body.text;

  updateJournalTextByUserAndPlantAndJournalId(
    user_id,
    garden_plant_id,
    journal_entry_id,
    textToUpdate
  )
    .then((updatedJournalEntry) => {
      res.status(200).send({ updatedEntry: updatedJournalEntry });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteUserGardenPlant = (request, response, next) => {
  const { user_id, garden_plant_id } = request.params;

  removeUserGardenPlant(user_id, garden_plant_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserGardenByUserId,
  getUserGardenPlantByUserAndPlantId,
  postUserGardenList,
  patchJournalTextByUserAndPlantAndJournalId,
  deleteUserGardenPlant,
};
