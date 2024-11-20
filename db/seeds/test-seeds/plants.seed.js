const client = require("../../connection");
const plantsToSeed = require(`../../data/${
  process.env.NODE_ENV || "development"
}-data/plants.json`);
const usersToSeed = require(`../../data/${
  process.env.NODE_ENV || "development"
}-data/users.json`);
const user_gardensToSeed = require(`../../data/${
  process.env.NODE_ENV || "development"
}-data/user_gardens.json`);

const seedCollections = () => {
  console.log(client, "< client");
  client
    .connect()
    .then(() => {
      console.log("Connected to the database.");
      const db = client.db(`buddy_${process.env.NODE_ENV || "dev"}`);
      const plants = db.collection("plants");
      const users = db.collection("users");
      const user_gardens = db.collection("user_gardens");

      return Promise.all([plants.drop(), users.drop(), user_gardens.drop()])
        .then(() => {
          console.log("Existing collections dropped.");
        })
        .then(() => plants.insertMany(plantsToSeed))
        .then(() => users.insertMany(usersToSeed))
        .then(() => user_gardens.insertMany(user_gardensToSeed));
    })
    .then(() => {
      console.log("Collections seeded successfully!");
    })
    .then(() => {
      if (!process.env.NODE_ENV) {
        client.close().then(() => {
          console.log("Database connection closed.");
        });
      }
    })
    .catch(() => {
      console.log(
        "At least one of the existing collections not found. Cannot seed data."
      );
    });
};

module.exports = { seedCollections };
