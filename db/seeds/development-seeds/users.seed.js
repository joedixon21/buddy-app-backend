const { MongoClient } = require("mongodb");
const usersToSeed = require("../../data/development-data/users.json");

// Connection URL
const uri = "mongodb://localhost:27017";

// Development Data

const client = new MongoClient(uri);

client
  .connect()
  .then(() => {
    console.log("Connected to the database.");
    const db = client.db("buddy_dev");
    const users = db.collection("users");

    // Drop the users collection if it exists
    return users
      .drop()
      .then(() => {
        console.log("Existing users collection dropped.");
      })
      .catch(() => {
        console.log(
          "No existing users collection found. Proceeding to seed data."
        );
      })
      .then(() => users.insertMany(usersToSeed))
      .then(() => {
        console.log("Users collection seeded successfully!");
      });
  })
  .catch((err) => {
    console.error("An error occurred while seeding the users collection:", err);
  })
  .finally(() => {
    client.close().then(() => {
      console.log("Database connection closed.");
    });
  });
