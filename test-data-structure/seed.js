const { MongoClient } = require("mongodb");
const plantsToEnter = require("./plants.json");

// Connection URL
const uri = "mongodb://localhost:27017";

// Test Data

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
      .then(() => collection.insertMany(plantsToEnter))
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
