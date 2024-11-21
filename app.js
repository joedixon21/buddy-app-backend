const express = require("express");
const { mongoose, URI } = require("./db/connection");
const app = express();
const endpoints = require("./endpoints.json");
const cors = require("cors");
const { customErrorHandle, ServerErrorHandle } = require("./error-handling");
const { getAllPlantsList } = require("./controllers/plants.controller");
const {
  getUserGardenByUserId,
} = require("./controllers/user_gardens.controller");
// const {} = require("./controllers/user_gardens.controller");
// const {} = require("./controllers/users.controller");
// app.use(cors());

app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).json({ endpoints });
});

app.get("/api/plants", getAllPlantsList);
app.get("/api/plants/:plant_id");

app.get("/api/:user_garden");
app.get("/api/:user_garden/:garden_plant_id");
app.post("/api/:user_garden/:garden_plant_id");
app.patch("/api/:user_garden/:garden_plant_id");
app.delete("/api/:user_garden/:garden_plant_id");

app.get("/api/users");

app.get("/api/user_gardens/:user_id", getUserGardenByUserId);

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" });
});

app.use(customErrorHandle);
app.use(ServerErrorHandle);

mongoose
  .connect(URI)
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Failed to connect to database.");
    console.log(err);
  });

module.exports = app;
