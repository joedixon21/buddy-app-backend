const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const { seedCollections } = require("../db/seeds/seed");
const endpoints = require("../endpoints.json");
const { UserGarden } = require("../models/user_gardens.model");
const { getAllPlantsList } = require("../controllers/plants.controller");

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
        const plants = body.plants;
        expect(plants.length).toBe(39);
        plants.forEach((plant) => {
          expect(plant).not.toHaveProperty("extra_info");
          expect(typeof plant.plant_id).toBe("number");
          expect(typeof plant.common_name).toBe("string");
          expect(typeof plant.scientific_name).toBe("object");
        });
      });
  });
  test("GET: 200 (?search=partial_common_name) - responds with an array of plant objects whose common name partially matches the query string", () => {
    return request(app)
      .get("/api/plants?search=maple")
      .expect(200)
      .then(({ body }) => {
        const plants = body.plants;
        expect(plants.length).not.toBe(0);
        expect(plants.length).toBe(6);
        plants.forEach((plant) => {
          expect(plant.common_name.includes("maple"));
        });
      });
  });
  test("GET: 200 (?search=partial_common_name) - search term is case insensitive", () => {
    return request(app)
      .get("/api/plants?search=MAPLE")
      .expect(200)
      .then(({ body }) => {
        const plants = body.plants;
        expect(plants.length).not.toBe(0);
        expect(plants.length).toBe(6);
        plants.forEach((plant) => {
          expect(plant.common_name.includes("maple"));
        });
      });
  });
  test("GET: 404 (?search=(common_name)) - returns a not found error when the plants array is empty", () => {
    return request(app)
      .get("/api/plants?search=thiswillnotmatchaplant")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
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

describe("/api/user_garden/:user_id/plants/:garden_plant_id/journal", () => {
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

describe("/api/user_garden/:user_id/plants/:garden_plant_id/journal/:journal_entry_id", () => {
  test("DELETE: 204, responds by deleting a journal entry of a users plant within their garden", async () => {
    const userId = 1;
    const plantId = 1;
    const journalEntryId = await UserGarden.findOne({ user_id: userId })
      .exec()
      .then((userGarden) => {
        const targetPlant = userGarden.user_plants.filter((plant) => {
          return plant.garden_plant_id === plantId;
        })[0];
        const journalId = targetPlant.journal_entries[0]._id;
        return journalId;
      });
    return request(app)
      .delete(`/api/user_garden/1/plants/1/journal/${journalEntryId}`)
      .expect(204)
      .then(() => {
        return request(app)
          .get(`/api/user_garden/1/plants/1/journal/${journalEntryId}`)
          .expect(404);
      });
  });
  test("DELETE: 404, responds with an error when requested user does not exist on the database", () => {
    return request(app)
      .delete("/api/user_garden/9999/plants/1/journal/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Garden Not Found");
      });
  });
  test("DELETE: 404, responds with an error when requested plant in a user garden does not exist on the database", () => {
    return request(app)
      .delete("/api/user_garden/1/plants/9999/journal/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Plant Not Found");
      });
  });
  test("DELETE: 404, responds with an error when requested journal_entry_id to be deleted does not exist on the database", () => {
    return request(app)
      .delete("/api/user_garden/1/plants/2/journal/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Journal Entry Not Found");
      });
  });
  test("DELETE: 400, responds with an error when invalid user_id data type is requested to direct to a journal entry", () => {
    return request(app)
      .delete("/api/user_garden/not_valid_data/plants/1/journal/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/user_garden/:user_id/plants/:garden_plant_id", () => {
  test("DELETE: 204, responds by deleting a users garden plant by garden_plant_id", () => {
    return request(app)
      .delete("/api/user_garden/1/plants/1")
      .expect(204)
      .then(() => {
        return request(app).get("/api/user_garden/1/plants/1").expect(404);
      });
  });
  test("DELETE: 404, responds with an error when requested user does not exist on the database", () => {
    return request(app)
      .delete("/api/user_garden/9999/plants/1")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User Garden Not Found");
      });
  });
  test("DELETE: 404, responds with an error when requested plant in a user garden does not exist on the database", () => {
    return request(app)
      .delete("/api/user_garden/1/plants/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Plant Not Found");
      });
  });
  test("DELETE: 400, responds with an error when invalid user_id data type is requested", () => {
    return request(app)
      .delete("/api/user_garden/not_valid_data/plants/1")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
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

describe("/api/user_garden/:user_id/plants/:plant_id/journal/:journal_entry_id", () => {
  test("PATCH: 200 - Returns the updated journal entry with patched text", async () => {
    const journalTextToChange = { text: "Wow the test worked..." };
    const userId = 1;
    const plantId = 1;
    const journalEntryId = await UserGarden.findOne({ user_id: userId })
      .exec()
      .then((userGarden) => {
        const targetPlant = userGarden.user_plants.filter((plant) => {
          return plant.garden_plant_id === plantId;
        })[0];
        const journalId = targetPlant.journal_entries[0]._id;
        return journalId;
      });

    return request(app)
      .patch(
        `/api/user_garden/${userId}/plants/${plantId}/journal/${journalEntryId}`
      )
      .send(journalTextToChange)
      .expect(200)
      .then(({ body }) => {
        const updatedJournalEntry = body.updatedEntry;
        expect(updatedJournalEntry.text).toBe("Wow the test worked...");
        expect(updatedJournalEntry).toHaveProperty("date");
        expect(updatedJournalEntry).toHaveProperty("height_entry_in_cm");
      });
  });
  test("PATCH: 200 - The updated journal persists in the database", async () => {
    const userId = 1;
    const plantId = 1;
    const journalEntryId = await UserGarden.findOne({ user_id: userId })
      .exec()
      .then((userGarden) => {
        const targetPlant = userGarden.user_plants.filter((plant) => {
          return plant.garden_plant_id === plantId;
        })[0];
        const journalId = targetPlant.journal_entries[0]._id;
        return journalId.toString();
      });
    await UserGarden.findOne({ user_id: userId })
      .exec()
      .then((userGarden) => {
        const targetPlant = userGarden.user_plants.filter((plant) => {
          return plant.garden_plant_id === plantId;
        })[0];

        const targetEntry = targetPlant.journal_entries.filter((entry) => {
          return entry._id.toString() === journalEntryId;
        })[0];

        expect(targetEntry.text).toBe("Wow the test worked...");
        expect(targetEntry._id.toString()).toBe(journalEntryId);
        expect(targetEntry).toHaveProperty("date");
        expect(targetEntry).toHaveProperty("height_entry_in_cm");
      });
  });

  test("PATCH: 400 - Returns a bad request error when the user_id is an invalid format", () => {
    const journalTextToChange = { text: "Wow the test worked..." };

    return request(app)
      .patch(`/api/user_garden/invalid_id/plants/1/journal/ignore_this`)
      .send(journalTextToChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });
  test("PATCH: 400 - Returns a bad request error when the garden_plant_id is an invalid format", () => {
    const journalTextToChange = { text: "Wow the test worked..." };

    return request(app)
      .patch(`/api/user_garden/1/plants/invalid_id/journal/ignore_this`)
      .send(journalTextToChange)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });
  test("PATCH 404 - Returns a not found error when the user_id is valid but does not exist", () => {
    const journalTextToChange = { text: "Wow the test worked..." };

    return request(app)
      .patch(`/api/user_garden/9999/plants/1/journal/ignore_this`)
      .send(journalTextToChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
  test("PATCH 404 - Returns a not found error when the garden_plant_id is valid but does not exist", () => {
    const journalTextToChange = { text: "Wow the test worked..." };

    return request(app)
      .patch(`/api/user_garden/1/plants/9999/journal/ignore_this`)
      .send(journalTextToChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
  test("PATCH 404 - Returns a not found error when the journal_entry_id does not exist", () => {
    const journalTextToChange = { text: "Wow the test worked..." };

    return request(app)
      .patch(`/api/user_garden/1/plants/1/journal/bad_id`)
      .send(journalTextToChange)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });
});

describe("/api/user_garden/:user_id/plants/:garden_plant_id", () => {
  test("PATCH 200: Returns the updated plant with the new nickname", () => {
    const newNickname = {
      nickname: "Phillis",
    };

    return request(app)
      .patch("/api/user_garden/1/plants/1")
      .send(newNickname)
      .expect(200)
      .then(({ body }) => {
        const updatedPlant = body.updatedPlant;

        expect(updatedPlant).toHaveProperty("nickname", "Phillis");
        expect(updatedPlant).toHaveProperty("garden_plant_id");
        expect(updatedPlant).toHaveProperty("last_watered");
        expect(updatedPlant).toHaveProperty("journal_entries");
      });
  });

  test("PATCH 200: Returns the updated plant with the last_watered property set to Date.now()", () => {
    const waterPlant = {
      water_plant: true,
    };

    return request(app)
      .patch("/api/user_garden/1/plants/1")
      .send(waterPlant)
      .expect(200)
      .then(({ body }) => {
        const updatedPlant = body.updatedPlant;
        const currDate = new Date().toISOString().slice(0, 10);

        expect(updatedPlant).toHaveProperty("nickname");
        expect(updatedPlant).toHaveProperty("garden_plant_id");
        expect(updatedPlant.last_watered.includes(currDate)).toBe(true);
        expect(updatedPlant).toHaveProperty("journal_entries");
      });
  });

  test("PATCH 400: Returns a bad request error when no valid key is added to the request object", () => {
    return request(app)
      .patch("/api/user_garden/1/plants/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });

  test("PATCH 400: Returns a bad request error the water_plant request value is not 'true'", () => {
    return request(app)
      .patch("/api/user_garden/1/plants/1")
      .send({ water_plant: 123 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });

  test("PATCH 404: Returns a not found error when no user of that id exists", () => {
    return request(app)
      .patch("/api/user_garden/999/plants/1")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });

  test("PATCH 404: Returns a not found error when there is no plant with that id in the users garden", () => {
    return request(app)
      .patch("/api/user_garden/1/plants/999")
      .send({})
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
        expect(body.status).toBe(404);
      });
  });

  test("PATCH 400: Returns a bad request if the nickname provided is longer than 20 characters", () => {
    return request(app)
      .patch("/api/user_garden/1/plants/1")
      .send({ nickname: "This nickname is just far too long." })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
        expect(body.status).toBe(400);
      });
  });
});
