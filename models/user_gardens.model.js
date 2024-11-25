const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: { type: String, default: new Date().toISOString() },
  text: { type: String, required: true },
  height_entry_in_cm: { type: Number },
});

const UserPlantSchema = new mongoose.Schema({
  garden_plant_id: { type: Number, required: true },
  plant_id: { type: Number, required: true },
  last_watered: {
    type: String,
    required: true,
    default: new Date().toISOString(),
  },
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

const updateJournalTextByUserAndPlantAndJournalId = (
  userId,
  gardenPlantId,
  journalEntryId,
  textToUpdate
) => {
  if (Number.isNaN(+userId) || Number.isNaN(+gardenPlantId)) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  return UserGarden.findOne({ user_id: userId })
    .exec()
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }

      const targetPlant = userGarden.user_plants.filter((plant) => {
        return plant.garden_plant_id === Number(gardenPlantId);
      })[0];

      if (!targetPlant) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }

      const targetJournalEntry = targetPlant.journal_entries.filter((entry) => {
        return entry._id.toString() === journalEntryId;
      })[0];

      if (!targetJournalEntry) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }

      targetJournalEntry.text = textToUpdate;

      userGarden.markModified("user_plants");
      return Promise.all([userGarden.save(), targetJournalEntry]);
    })
    .then(([_, updatedJournalEntry]) => {
      return updatedJournalEntry;
    });
};

const removeUserGardenPlant = (user_id, garden_plant_id) => {
  if (Number.isNaN(Number(user_id))) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return UserGarden.findOne({ user_id })
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ status: 404, msg: "User Garden Not Found" });
      }
      userGarden.updateOne({
        $pull: { user_plants: { garden_plant_id: Number(garden_plant_id) } },
      });
    })
    .then((response) => {
      return response;
    });
};

const updatePlantDetails = ({
  user_id,
  garden_plant_id,
  nickname,
  water_plant,
}) => {
  const rejectWithNotFound = () => {
    return Promise.reject({ msg: "Not found", status: 404 });
  };

  const rejectWithBadRequest = () => {
    return Promise.reject({ msg: "Bad request", status: 400 });
  };

  return UserGarden.findOne({ user_id: user_id }).then((userGarden) => {
    if (!userGarden) {
      return rejectWithNotFound();
    }

    const plantToUpdate = userGarden.user_plants.filter((plant) => {
      return plant.garden_plant_id === Number(garden_plant_id);
    })[0];

    if (!plantToUpdate) {
      return rejectWithNotFound();
    }

    if (nickname && nickname.length > 20) {
      return rejectWithBadRequest();
    }

    if (!nickname && water_plant !== true) {
      return rejectWithBadRequest();
    }

    if (water_plant === true) {
      plantToUpdate.last_watered = new Date().toISOString();
    }

    if (nickname) {
      plantToUpdate.nickname = nickname;
    }

    userGarden.markModified("user_plants");
    return Promise.all([userGarden.save(), plantToUpdate]).then(
      ([_, updatedPlant]) => {
        return updatedPlant;
      }
    );
  });
};

const addPlantToUserGardenByUserId = ({ user_id, plantToAdd }) => {
  return UserGarden.findOne({ user_id: user_id })
    .then((userGarden) => {
      if (!plantToAdd.common_name || !plantToAdd.plant_id) {
        return Promise.reject({ status: 400, msg: "Bad request" });
      }

      if (!userGarden) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }

      const plantToPush = {
        nickname: plantToAdd.common_name,
        user_id: +user_id,
        garden_plant_id: userGarden.user_plants.length + 1,
        plant_id: plantToAdd.plant_id,
        last_watered: new Date().toISOString(),
        journal_entries: [],
      };

      userGarden.user_plants.push(plantToPush);

      const newPlant =
        userGarden.user_plants[userGarden.user_plants.length - 1];

      userGarden.markModified("user_plants");

      return Promise.all([userGarden.save(), newPlant]);
    })
    .then(([_, newPlant]) => {
      return newPlant;
    });
};

module.exports = {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
  updateJournalTextByUserAndPlantAndJournalId,
  createNewJournalEntry,
  UserGarden,
  removeUserGardenPlant,
  updatePlantDetails,
  addPlantToUserGardenByUserId,
};
