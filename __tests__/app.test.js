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

describe.only("/api/user_garden/:user_id/plants/:garden_plant_id", () => {
  test("POST: 201 - responds to a garden_plant_id with an object witha new journal entry added", () => {
    const newJournalEntry = {
      text: "Leaves are looking a little yellow",
      height_entry_in_cm: 20,
    };
    return request(app)
      .post("/api/user_garden/1/plants/1/journal")
      .send(newJournalEntry)
      .expect(201)
      .then(({ body }) => {
        const newEntry = body.new_entry;
        expect(typeof newEntry.text).toBe("string");
        expect(typeof newEntry.height_entry_in_cm).toBe("number");
        expect(newEntry.text).toBe("Leaves are looking a little yellow");
        expect(newEntry.height_entry_in_cm).toBe(20);
      });
  });
  test("POST: 404, responds with an error when an invalid garden_plant_id is given that is not present on the database", () => {
    const newJournalEntry = {
      text: "Plant is looking sad",
      height_entry_in_cm: 16,
    };
    return request(app)
      .post("/api/user_garden/1/plants/12/journal")
      .send(newJournalEntry)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST: 404, responds with an error when an invalid user_id is given that is not present on the database", () => {
    const newJournalEntry = {
      text: "There's flowers!",
      height_entry_in_cm: 42,
    };
    return request(app)
      .post("/api/user_garden/13/plants/1/journal")
      .send(newJournalEntry)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("POST: 400, responds with an error when a required field is missing", () => {
    const newJournalEntry = {
      text: "",
      height_entry_in_cm: 30,
    };
    return request(app)
      .post("/api/user_garden/1/plants/1/journal")
      .send(newJournalEntry)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});
