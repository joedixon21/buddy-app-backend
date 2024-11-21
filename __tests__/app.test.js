const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seedCollections } = require("../db/seeds/seed");
// const endpoints = require("../endpoints.json");

beforeAll(() => {
  return seedCollections();
});

afterAll(() => {
  return mongoose.disconnect().then(() => {
    console.log("Closed database successfully!");
  });
});

describe("/api/plants", () => {
  test("GET: 200 - responds with an array of plant objects with properties: ...", () => {
    return request(app)
      .get("/api/plants")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(40);
        body.forEach((plant) => {
          expect(typeof plant.common_name).toBe("string");
          expect(typeof plant.scientific_name).toBe("object");
        });
      });
  });
});

describe("/api/user_gardens/:user_id", () => {
  test("GET: 200 - responds with a single user_garden object with the correct properties", () => {
    return request(app)
      .get("/api/user_gardens/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("user_id", 1);
        expect(body).toHaveProperty("user_plants");

        const plants = body.user_plants;

        expect(Array.isArray(plants) && plants.length > 0).toBe(true);

        plants.forEach((plant) => {
          expect(plant).toHaveProperty("garden_plant_id");
          expect(plant).toHaveProperty("plant_id");
          expect(plant).toHaveProperty("last_watered");
          expect(plant).toHaveProperty("nickname");
          expect(plant).toHaveProperty("journal_entries");

          const journalEntries = plant.journal_entries;

          expect(
            Array.isArray(journalEntries) && journalEntries.length > 0
          ).toBe(true);

          journalEntries.forEach((journalEntry) => {
            expect(journalEntry).toHaveProperty("date");
            expect(journalEntry).toHaveProperty("text");
            expect(journalEntry).toHaveProperty("height_entry_in_cm");
          });
        });
      });
  });
  test("GET: 404 - Returns a not found error when no user garden of the associated id exists", () => {
    return request(app)
      .get("/api/user_gardens/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
  test("GET: 400 - Returns a bad request error when user id is not a number", () => {
    return request(app)
      .get("/api/user_gardens/abc")
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe("Bad request");
      });
  });
});
