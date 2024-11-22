const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: { type: String, required: true },
  text: { type: String, required: true },
  height_entry_in_cm: { type: Number, required: true },
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
  console.log(Number.isNaN(Number(plant_id)), plant_id);
  console.log(Number.isNaN(Number(user_id)), user_id);

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

module.exports = {
  fetchUserGardenByUserId,
  fetchUserGardenPlantByUserAndPlantId,
};
