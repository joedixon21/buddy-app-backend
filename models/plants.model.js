const mongoose = require("mongoose");

const PlantListSchema = mongoose.Schema({
  common_name: {
    type: String,
    required: true,
  },
  scientific_name: {
    type: String,
    required: true,
  },
  other_name: String,
  cycle: {
    type: String,
    required: true,
  },
  watering_frequency_in_days: {
    type: Number,
    required: true,
  },
  sunlight: {
    type: String,
    required: true,
  },
  default_image: {
    type: String,
    required: true,
  },
  extra_info: {
    family: String,
    type: String,
    max_height: Number,
    pruning_month: [String],
    maintenance: String,
    soil: String,
    growth_rate: Number,
    invasive: Boolean,
    indoor: Boolean,
    care_level: String,
    medicinal: Boolean,
    poisonous_to_humans: Number,
    poisonous_to_pets: Number,
    description: String,
  },
});

const Plant = mongoose.model("Plant", PlantListSchema);

module.exports = Plant;
