const axios = require("axios");
const mongoose = require("mongoose");
const db = mongoose.connection;

// mongoose.connect(
//   `mongodb+srv://${user}:${password}@${URL}`,
//   { useNewUrlParser: true },
//   function (err) {
//     if (err) throw err;

//     console.log("Successfully connected");
//   }
// );

const api = axios.create({
  baseURL: "https://perenual.com/api",
});

const getAllPlants = () => {
  // return api
  //   .get(`/species-list`, {
  //     params: {
  //       key: "sk-hy196735e4da80ca17633",
  //     },
  //   })
  //   .then(({ data: { data } }) => {
  //     // return data.map((plant) => plant.id);
  //   })
  //   .then((plantIds) => {
  const plantIds = [1];
  const mappedPlants = plantIds.map((plant_id) => {
    return api
      .get(`/species/details/${plant_id}`, {
        params: {
          key: "sk-hy196735e4da80ca17633",
        },
      })
      .then(({ plant }) => {
        console.log(plant, "< plant");
        return {
          plant_id: plant.id,
          common_name: plant.commmon_name,
          scientific_name: plant.scientific_name,
          other_name: plant.other_name,
          cycle: plant.cycle,
        };
      });
  });
  return Promise.all(mappedPlants)
    .then((data) => {
      console.log(data, "< mappedPlants");
    })
    .catch((error) => {
      throw error;
    });
};

getAllPlants();

export const getSingleArticle = (article_id) => {
  return api
    .get(`/articles/${article_id}`)
    .then((response) => {
      return response.data.article;
    })
    .catch((error) => {
      throw error;
    });
};
