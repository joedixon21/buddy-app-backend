const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: {
    type: Number,
    default: Date.now(),
  },
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

const createNewJournalEntry = (user_id, garden_plant_id, journalEntry) => {
  return UserGarden.findOne({ user_id })
    .then((userGarden) => {
      const plantToUpdate = userGarden.user_plants.filter(
        (plant) => plant.garden_plant_id === Number(garden_plant_id)
      )[0];

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

module.exports = { UserGarden, createNewJournalEntry };
