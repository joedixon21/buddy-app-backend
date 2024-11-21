const { fetchUserGardenByUserId } = require("../models/user_gardens.model");

const getUserGardenByUserId = (req, res, next) => {
  const { user_id } = req.params;

  fetchUserGardenByUserId(user_id)
    .then((userGarden) => {
      res.status(200).send(userGarden);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUserGardenByUserId };
