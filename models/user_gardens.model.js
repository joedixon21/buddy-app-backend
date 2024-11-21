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

const fetchUserGardenByUserId = (user_id) => {
  if (Number.isNaN(+user_id)) {
    return Promise.reject({ msg: "Bad request", status: 400 });
  }
  return UserGarden.findOne({
    user_id: user_id,
  })
    .exec()
    .then((userGarden) => {
      if (!userGarden) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }
      return userGarden;
    });
};

module.exports = { fetchUserGardenByUserId };
