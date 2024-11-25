const { MongoClient } = require("mongodb");
const mongoose = require("mongoose");

// Determine the environment (default to 'development')
const ENV = process.env.NODE_ENV || "development";

// Dynamically load the appropriate .env file
require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

// Get the MongoDB URI from the environment variables
const URI = process.env.MONGO_URI;

// Initialize MongoClient with the URI
const client = new MongoClient(URI);

module.exports = { mongoose, URI, client };
