const express = require("express");
const app = express();
const cors = require("cors");

// Require controller functions here
// const {} = require("./controllers/plants.controller");
// const {} = require("./controllers/user_gardens.controller");
// const {} = require("./controllers/users.controller");

const { customErrorHandle, ServerErrorHandle } = require("./error-handling");

app.use(cors());
app.use(express.json());

app.get("/api", (request, response) => {
  response.status(200).send({ endpoints });
});

// Insert API functions below
app.get("/api/plants");
app.get("/api/plants/:plant_id");

app.get("/api/:user_garden");
app.get("/api/:user_garden/:garden_plant_id");
app.post("/api/:user_garden/:garden_plant_id");
app.patch("/api/:user_garden/:garden_plant_id");
app.delete("/api/:user_garden/:garden_plant_id");

app.get("/api/users");

app.all("*", (request, response, next) => {
  response.status(404).send({ msg: "Path Not Found" });
});

// Update error handling below
app.use(customErrorHandle);
app.use(ServerErrorHandle);

module.exports = app;
