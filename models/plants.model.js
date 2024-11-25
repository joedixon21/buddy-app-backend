const mongoose = require("mongoose");

const PlantSchema = mongoose.Schema({
  plant_id: { type: Number, required: true, index: { unique: true } },
  common_name: { type: String, required: true },
  scientific_name: [{ type: String }],
  other_name: [{ type: String }],
  cycle: { type: String },
  watering_frequency_in_days: { type: Number },
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

const Plant = mongoose.model("Plant", PlantSchema);

const fetchAllPlants = ({ searchTerm }) => {
  const fields = [
    "plant_id",
    "common_name",
    "scientific_name",
    "cycle",
    "watering_frequency_in_days",
    "sunlight",
    "default_image",
  ];
  const selectedFields = fields.join(" ");
  const findQuery = searchTerm
    ? { common_name: { $regex: `${searchTerm}`, $options: "i" } }
    : {};
  return Plant.find(findQuery)
    .select(selectedFields)
    .then((plants) => {
      if (!plants.length) {
        return Promise.reject({ msg: "Not found", status: 404 });
      }

      return plants;
    });
};

const fetchPlantById = (plant_id) => {
  if (isNaN(plant_id)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  return Plant.findOne({ plant_id }).then((plant) => {
    if (!plant) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    }
    return plant;
  });
};

module.exports = { fetchAllPlants, fetchPlantById };
