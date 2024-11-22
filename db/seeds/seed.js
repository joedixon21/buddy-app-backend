const { mongoose, URI, client } = require("../connection");
const plantsToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/plants.json`);
const usersToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/users.json`);
const user_gardensToSeed = require(`../data/${
  process.env.NODE_ENV || "development"
}-data/user_gardens.json`);

const seedCollections = () => {
  const db = client.db(process.env.MONGO_STACK);
  const plants = db.collection("plants");
  const users = db.collection("users");
  const user_gardens = db.collection("user_gardens");

  return client
    .connect()
    .then(() => {
      return Promise.all([
        plants
          .drop()
          .catch((err) =>
            console.log("Plants collection not found:", err.message)
          ),
        users
          .drop()
          .catch((err) =>
            console.log("Users collection not found:", err.message)
          ),
        user_gardens
          .drop()
          .catch((err) =>
            console.log("User Gardens collection not found:", err.message)
          ),
      ]);
    })
    .then(() => {
      return Promise.all([
        plants.insertMany(plantsToSeed),
        users.insertMany(usersToSeed),
        user_gardens.insertMany(user_gardensToSeed),
      ]);
    })
    .finally(() => {
      return client.close();
    })
    .catch((err) => {
      console.error("Error during seeding:", err.message);
      throw err;
    });
};

module.exports = { seedCollections };
