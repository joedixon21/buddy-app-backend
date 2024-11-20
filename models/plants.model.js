const mongoose = require("mongoose");

exports.fetchAllPlantsList = mongoose.Schema({
  common_name: {
    type: String,
    required: true,
  },
});
