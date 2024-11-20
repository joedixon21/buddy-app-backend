const { MongoClient } = require("mongodb");
const user_gardensToSeed = require("../../data/test-data/user_gardens.json");

export const seedUser_gardens = () => {
  // Connection URL
  const uri = "mongodb://localhost:27017";

  // Test Data

  const client = new MongoClient(uri);

  client
    .connect()
    .then(() => {
      console.log("Connected to the database.");
      const db = client.db("buddy_test");
      const user_gardens = db.collection("user_gardens");

      // Drop the user_gardens collection if it exists
      return user_gardens
        .drop()
        .then(() => {
          console.log("Existing user_gardens collection dropped.");
        })
        .catch(() => {
          console.log(
            "No existing user_gardens collection found. Proceeding to seed data."
          );
        })
        .then(() => user_gardens.insertMany(user_gardensToSeed))
        .then(() => {
          console.log("User_gardens collection seeded successfully!");
        });
    })
    .catch((err) => {
      console.error(
        "An error occurred while seeding the user_gardens collection:",
        err
      );
    });
};
