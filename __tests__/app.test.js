const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seedCollections } = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeAll(() => {
  return seedCollections();
});

afterAll(() => {
  return mongoose.disconnect();
});

describe("/api/plants", () => {
  test("GET: 200 - responds with an array of plant objects with properties: plant_id, common_name, scientific_name, cycle, watering_frequency_in_days, ", () => {
    return request(app)
      .get("/api/plants")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(39);
        body.forEach((plant) => {
          expect(plant).not.toHaveProperty("extra_info");
          expect(typeof plant.plant_id).toBe("number");
          expect(typeof plant.common_name).toBe("string");
          expect(Array.isArray(plant.scientific_name)).toBe(true);
          expect(typeof plant.cycle).toBe("string");
          if (!plant.watering_frequency_in_days) {
            expect(plant.watering_frequency_in_days).toBe(null);
          } else {
            expect(typeof plant.watering_frequency_in_days).toBe("number");
          }
          expect(Array.isArray(plant.sunlight)).toBe(true);
          expect(typeof plant.default_image).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET: 404 - responds with message of 'Path Not Found' when attempting to access a non-existent endpoint", () => {
    return request(app)
      .get("/api/chocolate")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path Not Found");
      });
  });
  test("GET: 200 - responds with an object detailing all available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpoints);
      });
  });
});

describe("/api/plants/:plant_id", () => {
  test("GET: 200 - responds with a plant by its id", () => {
    return request(app)
      .get("/api/plants/543")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("plant_id", 543);
        expect(body).toHaveProperty("common_name", "maidenhair fern");
        expect(body).toHaveProperty("cycle", "Perennial");
        expect(body).toHaveProperty("extra_info.family", "Pteridaceae");
      });
  });
  test("GET: 404 - responds with 'Not Found' when attempting to access a plant with a valid id that doesn't exist", () => {
    return request(app)
      .get("/api/plants/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not Found");
      });
  });
  test("GET: 400 - responds with 'Bad Request' when attempting to access an article with an invalid id", () => {
    return request(app)
      .get("/api/plants/not-a-valid-id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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

describe("/api/user_garden/:user_id/plants/:garden_plant_id", () => {
  test("POST: 201 - responds to a garden_plant_id with an object with a new journal entry added", () => {
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
