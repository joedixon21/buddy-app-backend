const express = require("express");
const { mongoose, URI } = require("./db/connection");
const app = express();
const endpoints = require("./endpoints.json");
const cors = require("cors");
const { customErrorHandle, ServerErrorHandle } = require("./error-handling");
const {
  getAllPlantsList,
  getPlantById,
} = require("./controllers/plants.controller");
const {
  getUserGardenByUserId,
  getUserGardenPlantByUserAndPlantId,
  postUserGardenList,
  deleteUserGardenPlantJournalEntryById,
  patchJournalTextByUserAndPlantAndJournalId,
  deleteUserGardenPlant,
  patchPlantDetails,
  postPlantToUserGardenByUserId,
} = require("./controllers/user_gardens.controller");

const {
  getAllUsersList,
  getUserById,
} = require("./controllers/users.controller");
app.use(cors());

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).json({ endpoints });
});

app.get("/api/plants", getAllPlantsList);

app.get("/api/plants/:plant_id", getPlantById);

app.post(
  "/api/user_garden/:user_id/plants/:garden_plant_id/journal",
  postUserGardenList
);

app.post("/api/user_garden/:user_id/plants", postPlantToUserGardenByUserId);

app.delete(
  "/api/user_garden/:user_id/plants/:garden_plant_id",
  deleteUserGardenPlant
);
app.delete(
  "/api/user_garden/:user_id/plants/:garden_plant_id/journal/:journal_entry_id",
  deleteUserGardenPlantJournalEntryById
);

app.get("/api/users", getAllUsersList);
app.get("/api/users/:user_id", getUserById);

app.get("/api/user_gardens/:user_id", getUserGardenByUserId);

app.get(
  "/api/user_gardens/:user_id/plants/:plant_id",
  getUserGardenPlantByUserAndPlantId
);

app.patch(
  "/api/user_garden/:user_id/plants/:garden_plant_id/journal/:journal_entry_id",
  patchJournalTextByUserAndPlantAndJournalId
);

app.patch(
  "/api/user_garden/:user_id/plants/:garden_plant_id",
  patchPlantDetails
);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" });
});

app.use(customErrorHandle);
app.use(ServerErrorHandle);

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to database.");
  })
  .catch((err) => {
    console.log("Failed to connect to database.");
    console.log(err);
  });

module.exports = app;
