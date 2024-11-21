const { createNewJournalEntry } = require("../models/user-gardens.model");

const postUserGardenList = (request, response, next) => {
  const { user_id, garden_plant_id } = request.params;
  const journalEntry = request.body;

  console.log(request.body, "<< request body");

  createNewJournalEntry(user_id, garden_plant_id, journalEntry)
    .then((updatedJournal) => {
      console.log(updatedJournal, "<< in controller");
      response.status(201).send(updatedJournal);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = { postUserGardenList };
