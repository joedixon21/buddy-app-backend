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
        const userGarden = body.userGarden;
        expect(userGarden).toHaveProperty("user_id", 1);
        expect(userGarden).toHaveProperty("user_plants");

        const plants = userGarden.user_plants;

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
      .get("/api/user_gardens/invalid_format")
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400);
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("api/user_gardens/:user_id/plants/:plant_id", () => {
  test("GET 200: Returns an individual user plant by its id of the correct associated user ", () => {
    return request(app)
      .get("/api/user_gardens/1/plants/1")
      .expect(200)
      .then(({ body }) => {
        const plant = body.plant;

        expect(typeof body).toBe("object");
        expect(plant).toHaveProperty("garden_plant_id");
        expect(plant).toHaveProperty("last_watered");
        expect(plant).toHaveProperty("nickname");
        expect(plant).toHaveProperty("journal_entries");
        expect(plant).toHaveProperty("plant_id", 385);

        const journalEntries = plant.journal_entries;
        expect(journalEntries.length).not.toBe(0);
        expect(Array.isArray(journalEntries)).toBe(true);

        journalEntries.forEach((entry) => {
          expect(typeof entry).toBe("object");
          expect(entry).toHaveProperty("date");
          expect(entry).toHaveProperty("text");
          expect(entry).toHaveProperty("height_entry_in_cm");
        });
      });
  });
  test("GET 400: Sends a bad request error when the user id is not a number/valid format ", () => {
    return request(app)
      .get("/api/user_gardens/invalid_format/plants/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });
  test("GET 400: Sends a bad request error when the garden_plant id is not a number/valid format ", () => {
    return request(app)
      .get("/api/user_gardens/1/plants/invalid_format")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });
  test("GET 404: Sends a not found error when the user_id is valid but does not exist", () => {
    return request(app)
      .get("/api/user_gardens/9999/plants/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
  test("GET 404: Sends a not found error when the user_id is valid but does not exist", () => {
    return request(app)
      .get("/api/user_gardens/1/plants/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
});
