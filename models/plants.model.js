const mongoose = require("mongoose");

const PlantsSchema = mongoose.Schema({
  plant_id: { type: String, required: true, index: { unique: true } },
  common_name: { type: String, required: true },
  scientific_name: [{ type: String }],
  other_name: [{ type: String }],
  cycle: { type: String },
  watering_frequency_in_days: { type: String },
  sunlight: [{ type: String }],
  default_image: {
    type: String,
    default:
      "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  extra_info: {
    family: { type: String },
    type: { type: String },
    max_height: { type: Number },
    pruning_month: [{ type: String }],
    maintenance: { type: String },
    soil: [{ type: String }],
    growth_rate: { type: String },
    invasive: { type: Boolean },
    indoor: { type: Boolean },
    care_level: { type: String },
    medicinal: { type: Boolean },
    poisonous_to_humans: { type: Number },
    poisonous_to_pets: { type: Number },
    description: { type: String },
  },
});

exports.Plants = mongoose.model("Plants", PlantsSchema);
