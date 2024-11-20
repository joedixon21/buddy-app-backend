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

const UserGarden = mongoose.model("UserGarden", UserGardenSchema);

module.exports = UserGarden;
