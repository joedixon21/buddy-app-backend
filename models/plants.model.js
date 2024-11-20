const mongoose = require("mongoose");

const PlantListSchema = mongoose.Schema({
  common_name: {
    type: String,
    required: true,
  },
});

const Plant = mongoose.model("Plant", PlantListSchema);

module.exports = Plant;
