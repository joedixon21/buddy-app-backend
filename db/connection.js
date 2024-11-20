const { MongoClient } = require("mongodb");

const config = {
  dev: {
    uri: "mongodb://localhost:27017",
  },
  test: {
    uri: "mongodb://localhost:27017",
  },
};

const env = process.env.NODE_ENV || "dev";

const client = new MongoClient(config[env].uri);

module.exports = client;
