const { MongoClient } = require("mongodb");

// Connection URL
const uri = "mongodb://localhost:27017";

// Test Data
const seedData = [
  {
    plant_id: 1,
    common_name: "European Silver Fir",
    scientific_name: ["Abies alba"],
    other_name: ["Common Silver Fir"],
    cycle: "Perennial",
    watering_frequency_in_days: 7,
    sunlight: ["full sun"],
    default_image:
      "https://perenual.com/storage/species_image/2_abies_alba_pyramidalis/small/49255769768_df55596553_b.jpg",
    extra_info: {
      family: "Pinaceae",
      type: "tree",
      height: {
        min_value_in_cm: 60,
        max_value_in_cm: 60,
      },
      pruning_month: ["February", "March", "April"],
      maintenance: "Medium",
      soil: ["Loamy", "Sandy"],
      growth_rate: "High",
      invasive: false,
      indoor: false,
      care_level: "Medium",
      medicinal: true,
      poisonous_to_humans: 0,
      poisonous_to_pets: 0,
      description:
        "European Silver Fir (Abies alba) is an amazing coniferous species native to mountainous regions of central Europe and the Balkans...",
    },
  },
  {
    plant_id: 2,
    common_name: "Pyramidalis Silver Fir",
    scientific_name: ["Abies alba 'Pyramidalis'"],
    other_name: [],
    cycle: "Perennial",
    watering_frequency_in_days: 5,
    sunlight: ["full sun"],
    default_image:
      "https://perenual.com/storage/species_image/2_abies_alba_pyramidalis/small/49255769768_df55596553_b.jpg",
    extra_info: {
      family: "Pinaceae",
      type: "tree",
      height: {
        min_value_in_cm: 80,
        max_value_in_cm: 100,
      },
      pruning_month: ["March", "April"],
      maintenance: "Low",
      soil: ["Clay", "Silty"],
      growth_rate: "Medium",
      invasive: false,
      indoor: false,
      care_level: "Medium",
      medicinal: true,
      poisonous_to_humans: 0,
      poisonous_to_pets: 0,
      description:
        "Pyramidalis Silver Fir (Abies alba 'Pyramidalis') is a beautiful variation of the Silver Fir...",
    },
  },
];

const client = new MongoClient(uri);

client
  .connect()
  .then(() => {
    console.log("Connected to the database.");
    const db = client.db("buddy");
    const collection = db.collection("plants");

    // Drop the collection if it exists
    return collection
      .drop()
      .then(() => {
        console.log("Existing collection dropped.");
      })
      .catch(() => {
        console.log("No existing collection found. Proceeding to seed data.");
      })
      .then(() => collection.insertMany(seedData))
      .then(() => {
        console.log("Database seeded successfully!");
      });
  })
  .catch((err) => {
    console.error("An error occurred while seeding the database:", err);
  })
  .finally(() => {
    client.close().then(() => {
      console.log("Database connection closed.");
    });
  });
