const axios = require("axios");
const fs = require("fs/promises");

const api = axios.create({
  baseURL: "https://perenual.com/api",
});

const getAllPlants = (writeOrAppend) => {
  if (writeOrAppend !== "append" && writeOrAppend !== "write") {
    throw new Error("Please use append or write in the getAllPlants function");
  }
  const devPlantIds = [
    935, 830, 499, 697, 322, 215, 274, 308, 391, 58, 597, 443, 135, 588, 708,
    470, 703, 688, 489, 502, 834, 890, 493, 381, 322, 101, 173, 325, 637, 646,
    637, 3, 530, 999, 501, 503, 210, 198, 153, 376, 116, 760, 735, 859, 970,
    299, 533, 266, 773, 179, 499, 1, 680, 822, 509, 645, 161, 809, 917, 462,
    236, 715, 738, 884, 512, 865, 842, 148, 533, 525, 91, 537, 866, 299, 446,
    655, 787, 22, 431, 170, 739, 999, 870, 960, 22, 494, 424, 934, 168, 270,
    821, 703, 318, 892, 277, 56, 755, 191, 38, 817,
  ];
  const testPlantIds = [
    543, 877, 866, 980, 303, 940, 65, 626, 472, 287, 765, 125, 730, 568, 525,
    914, 339, 716, 418, 563, 607, 517, 678, 918, 385, 804, 687, 237, 499, 454,
    25, 968, 148, 723, 854, 984, 831, 156, 147,
  ];
  const mappedPlants = testPlantIds.map((plant_id) => {
    return api
      .get(`/species/details/${plant_id}`, {
        params: {
          // key: "sk-hy196735e4da80ca17633", //main key
          // key: "sk-89b8673ca3abd7c037695", //alt key
          key: "sk-K5a1673cd533db6bb7691", //key number 3
          // key: "sk-7ct3673dc7370b6ab7709", //Su's key
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
          watering_frequency_in_days:
            typeof plant.watering_general_benchmark.value === "string"
              ? Number(plant.watering_general_benchmark.value.split("-")[0])
              : null,
          sunlight: plant.sunlight,
          default_image:
            plant.default_image === null
              ? "https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
              : plant.default_image.small_url,
          extra_info: {
            family: plant.family,
            type: plant.type,
            max_height: plant.dimensions.max_value,
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
    .then((plants) => {
      const plantsToJSON = JSON.stringify(plants, null, 4);

      writeOrAppend === "append"
        ? fs.appendFile("db/data/development-data/plants.json", plantsToJSON)
        : fs.writeFile("db/data/development-data/plants.json", plantsToJSON);
    })
    .then(() => {
      console.log("File written or appended");
    })
    .catch((error) => {
      throw error;
    });
};

getAllPlants("write");

module.exports = { getAllPlants };
