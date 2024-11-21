const mongoose = require("mongoose");

const JournalEntrySchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
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
      const updatedJournal = userGarden.user_plants.filter(
        (plant) => plant.garden_plant_id === Number(garden_plant_id)
      )[0];

      updatedJournal.journal_entries.push(journalEntry);
      updatedJournal.markModified("journal_entries");
      return updatedJournal.save();
    })
    .then((updatedUserGarden) => {
      console.log(updatedUserGarden.journal_entries, "<< new entry");
      return updatedUserGarden.journal_entries;
    });
};

module.exports = { UserGarden, createNewJournalEntry };
