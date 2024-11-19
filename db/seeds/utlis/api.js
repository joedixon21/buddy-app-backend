const axios = require("axios");

const api = axios.create({
  baseURL: "https://perenual.com/api",
});

const getAllPlants = () => {
  // return api
  //   .get(`/species-list`, {
  //     params: {
  //       // key: "sk-hy196735e4da80ca17633", //main key
  //       key: "sk-89b8673ca3abd7c037695", //alt key
  //     },
  //   })
  //   .then(({ data: { data } }) => {
  //     return data.map((plant) => plant.id);
  //   })
  //   .then((plantIds) => {
    const plantIds = [1, 2]
    const mappedPlants = plantIds.map((plant_id) => {
    return api
      .get(`/species/details/${plant_id}`, {
        params: {
          // key: "sk-hy196735e4da80ca17633", //main key
          key: "sk-89b8673ca3abd7c037695", //alt key
        },
      })
      .then(({ data }) => {
        const plant = data;
        return {
          plant_id: plant.id,
          common_name: plant.common_name,
          scientific_name: plant.scientific_name,
          other_name: plant.other_name,
          cycle: plant.cycle,
          watering_frequency_in_days: typeof plant.watering_general_benchmark.value === "string" ? plant.watering_general_benchmark.value.split("-")[0] : null,
          sunlight: plant.sunlight,
          default_image: plant.default_image.small_url,
          extra_info: {
            family: plant.family,
            type: plant.type,
            height: {
              min_value_in_ft: plant.dimensions.min_value,
              max_value_in_ft: plant.dimensions.max_value,
            },
            pruning_month: plant.pruning_month,
            maintenance: plant.maintenance,
            soil: plant.soil,
            growth_rate: plant.growth_rate,
            invasive: plant.invasive,
            indoor: plant.invasive,
            care_level: plant.care_level,
            medicinal: plant.medicinal,
            poisonous_to_humans: plant.poisonous_to_humans,
            poisonous_to_pets: plant.poisonous_to_pets,
            description: plant.description,
          },
        };
      });
  });
  return Promise.all(mappedPlants)
    .then((data) => {
      console.log(data, "<< mapped plants")
      return data;
    })
    .catch((error) => {
      throw error;
    });
}
//);
//}

module.exports = { getAllPlants }

