const { createNewJournalEntry } = require("../models/user-gardens.model");

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

module.exports = { postUserGardenList };
