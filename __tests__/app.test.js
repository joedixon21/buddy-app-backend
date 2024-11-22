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

describe("/api/users", () => {
  test("GET: 200 - responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.length).toBe(2);
        body.forEach((user) => {
          expect(typeof user.display_name).toBe("string");
          expect(typeof user.password).toBe("string");
        });
      });
  }); 
});

describe("/api/users/:user_id", () => {
  test("GET: 200 - responds with an individual users", () => {
    return request(app)
      .get("/api/users/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("user_id", 1);
        expect(body).toHaveProperty("display_name", "Martha");
        expect(body).toHaveProperty("email", "martha21@gmail.com");
        expect(body).toHaveProperty("user_access", 0);
        });
      });
  test("GET: 404 - responds with 'Not Found' when a user attempt to access with a valid id that doesn't exist", () => {
        return request(app)
          .get("/api/users/99")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
  test("GET: 400 - responds with 'Bad Request' when attempt to access with an invalid id", () => {
        return request(app)
          .get("/api/users/not-a-valid-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
  }); 