const { MongoClient } = require("mongodb");
const plantsToSeed = require("../../data/development-data/plants.json");

// Connection URL
const uri = "mongodb://localhost:27017";

// Development Data

const client = new MongoClient(uri);

client
  .connect()
  .then(() => {
    console.log("Connected to the database.");
    const db = client.db("buddy_dev");
    const plants = db.collection("plants");

    // Drop the plants collection if it exists
    return plants
      .drop()
      .then(() => {
        console.log("Existing plants collection dropped.");
      })
      .catch(() => {
        console.log(
          "No existing plants collection found. Proceeding to seed data."
        );
      })
      .then(() => plants.insertMany(plantsToSeed))
      .then(() => {
        console.log("Plants collection seeded successfully!");
      });
  })
  .catch((err) => {
    console.error(
      "An error occurred while seeding the plants collection:",
      err
    );
  })
  .finally(() => {
    client.close().then(() => {
      console.log("Database connection closed.");
    });
  });
