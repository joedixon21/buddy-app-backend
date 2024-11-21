const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seedCollections } = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");

beforeAll(() => {
  return seedCollections();
});

afterAll(() => {
  return mongoose.disconnect().then(() => {
    console.log("Closed database successfully!");
  });
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
