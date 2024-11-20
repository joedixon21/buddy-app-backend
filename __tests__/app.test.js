const request = require("supertest");
const client = require("../db/connection");
// const app = require("../app");
const { seedCollections } = require("../db/seeds/seed");
// const {
//   seedUser_gardens,
// } = require("../db/seeds/test-seeds/user_gardens.seed");
// const { seedUsers } = require("../db/seeds/test-seeds/users.seed");
// const endpoints = require("../endpoints.json");

beforeEach(() => {
  return seedCollections();
});

afterAll(() => {
  return client.close();
});

// Test suite:

describe("/api/plants", () => {
  test("be 1", () => {
    expect(1).toBe(1);
  });
  // test("GET: 200 - responds with an array of plant objects with properties: ...", () => {
  //   return request(app)
  //     .get("/api/plants")
  //     .expect(200)
  //     .then(({ body }) => {
  //       console.log(body);
  //       expect(body.plants.length).toBe(10);
  //       body.plants.forEach((plant) => {
  //         expect(typeof plant.common_name).toBe("string");
  //         expect(typeof plant.scientific_name).toBe("string");
  //       });
  //     });
  // });
});
