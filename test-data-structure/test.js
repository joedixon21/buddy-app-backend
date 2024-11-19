// Seeding:

const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
let client;

function seedDB() {
  client = new MongoClient(uri);

  const seedData = [
    {
      plant_id: 1,
      common_name: "European Silver Fir",
      cycle: "Perennial",
      watering_frequency_in_days: 7,
      sunlight: ["full sun"],
    },
    {
      plant_id: 2,
      common_name: "Pyramidalis Silver Fir",
      cycle: "Perennial",
      watering_frequency_in_days: 5,
      sunlight: ["full sun"],
    },
  ];

  return client.connect().then(() => {
    const db = client.db("buddy");
    const collection = db.collection("plants");

    return collection
      .drop()
      .catch(() => console.log("No existing collection found."))
      .then(() => collection.insertMany(seedData))
      .then(() => console.log("Database seeded for tests."));
  });
}

beforeAll(() => {
  return seedDB();
});

afterAll(() => {
  return client.close();
});

// Test suite:

test("should fetch seeded plants", () => {
  const db = client.db("buddy");
  const collection = db.collection("plants");

  return collection
    .find()
    .toArray()
    .then((plants) => {
      expect(plants).toHaveLength(2);
      expect(plants[0].common_name).toBe("European Silver Fir");
    });
});

// // Model:

// const fetchPlants = () => {
//   return db
//     .collection("plants") // Replace "plants" with your collection name
//     .find({}) // Fetch all documents; pass filters if needed
//     .toArray(); // Convert the cursor to an array
// };

// // Controller:

// const getPlants = (req, res) => {
//   fetchPlants()
//     .then((plants) => {
//       res.status(200).send({ plants });
//     })
//     .catch((err) => {
//       console.error("Error fetching plants:", err);
//       res.status(500).send({ error: "Internal Server Error" });
//     });
// };

// // Express route:

// const express = require("express");
// const app = express();

// app.use(express.json()); // Middleware for parsing JSON requests

// // Route for fetching plants
// app.get("/api/plants", getPlants);

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
