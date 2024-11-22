const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: { type: Number, default: Date.now() },
  text: { type: String, required: true },
  height_entry_in_cm: { type: Number },
});

const UserPlantSchema = new mongoose.Schema({
  garden_plant_id: { type: Number, required: true },
  plant_id: { type: Number, required: true },
  last_watered: { type: String, required: true },
  nickname: { type: String, required: true },
  journal_entries: { type: [JournalEntrySchema], required: true },
});

const UserGardenSchema = new mongoose.Schema({
  user_id: { type: Number, required: true },
  user_plants: { type: [UserPlantSchema], required: true },
});

const UserGarden = mongoose.model("user_garden", UserGardenSchema);

const fetchUserGardenByUserId = (userId) => {
  if (Number.isNaN(+userId)) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  return UserGarden.findOne({
    user_id: userId,
  })
    .exec()
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      return userGarden;
    });
};

const fetchUserGardenPlantByUserAndPlantId = ({ user_id, plant_id }) => {
  if (Number.isNaN(Number(plant_id)) || Number.isNaN(Number(user_id))) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return UserGarden.findOne({ user_id: user_id }).then((userGarden) => {
    if (!userGarden) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    const plantToReturn = userGarden.user_plants.filter((plant) => {
      return plant.garden_plant_id === Number(plant_id);
    })[0];

    if (!plantToReturn) {
      return Promise.reject({ status: 404, msg: "Not found" });
    }
    return plantToReturn;
  });
};

const createNewJournalEntry = (user_id, garden_plant_id, journalEntry) => {
  if (journalEntry.text.length === 0) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return UserGarden.findOne({ user_id })
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      const plantToUpdate = userGarden.user_plants.filter(
        (plant) => plant.garden_plant_id === Number(garden_plant_id)
      )[0];

      if (!plantToUpdate) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }

      plantToUpdate.journal_entries.push(journalEntry);

      const newJournalEntry =
        plantToUpdate.journal_entries[plantToUpdate.journal_entries.length - 1];

      userGarden.markModified("user_plants");
      return Promise.all([userGarden.save(), newJournalEntry]);
    })
    .then(([_, newJournalEntry]) => {
      return newJournalEntry;
    });
};

const removeUserGardenPlantJournalEntryById = (
  user_id,
  garden_plant_id,
  journal_entry_id
) => {
  if (Number.isNaN(Number(user_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return UserGarden.findOne({ user_id })
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ status: 404, msg: "User Garden Not Found" });
      }
      const plantJournalEntryToRemove = userGarden.user_plants.find(
        (plant) => plant.garden_plant_id === Number(garden_plant_id)
      );

      plantJournalEntryToRemove.journal_entries =
        plantJournalEntryToRemove.journal_entries.filter(
          (entry) => entry._id.toString() !== journal_entry_id
        );
      userGarden.markModified("user_plants");
      return userGarden.save();
    })
    .then((response) => {
      return response;
    });
};

module.exports = {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
  createNewJournalEntry,
  UserGarden,
  removeUserGardenPlantJournalEntryById,
};
