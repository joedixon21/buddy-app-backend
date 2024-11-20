const client = require("../connection");
const plantsToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/plants.json`);
const usersToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/users.json`);
const user_gardensToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/user_gardens.json`);
const db = client.db(process.env.MONGO_STACK);
const plants = db.collection("plants");
const users = db.collection("users");
const user_gardens = db.collection("user_gardens");

const seedCollections = () => {
  return client
    .connect()
    .then(() => {
      console.log("Connected to the database.");

      return Promise.all([plants.drop(), users.drop(), user_gardens.drop()]);
    })
    .then(() => {
      console.log("Existing collections dropped.");
    })
    .then(() => {
      return plants.insertMany(plantsToSeed);
    })
    .then(() => {
      return users.insertMany(usersToSeed);
    })
    .then(() => {
      return user_gardens.insertMany(user_gardensToSeed);
    })
    .then(() => {
      console.log("Collections seeded successfully!");
    })
    .then(() => {
      if (!process.env.NODE_ENV) {
        client.close().then(() => {
          console.log("Database connection closed.");
        });
      } else return;
    })
    .catch((err) => {
      console.log(err);
      console.log(
        "At least one of the existing collections not found. Cannot seed data."
      );
    });
};

// Run for development database with npm run seed-dev:

module.exports = { seedCollections };
