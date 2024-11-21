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

describe.only("/api/user_gardens/:user_id/:garden_plant_id", () => {
  test("POST: 201 - responds with an object with journal entry", () => {
    const newJournalEntry = {
      text: "Leaves are looking a little yellow",
      height_entry_in_cm: 20,
    };
    return request(app)
      .post("/api/user_garden/1/plants/1/journal")
      .send(newJournalEntry)
      .expect(201)
      .then(({ body }) => {
        expect(typeof body[3].text).toBe("string");
        expect(typeof body[3].height_entry_in_cm).toBe("number");
        expect(body[3].text).toBe("Leaves are looking a little yellow");
        expect(body[3].height_entry_in_cm).toBe(20);
      });
  });
});
