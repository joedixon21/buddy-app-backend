const { MongoClient } = require("mongodb");
const ENV = process.env.NODE_ENV || "development";

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

const URI = process.env.MONGO_URI;

const client = new MongoClient(URI);

module.exports = client;
