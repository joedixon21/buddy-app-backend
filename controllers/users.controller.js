const { fetchAllUsers, fetchUserById } = require("../models/users.model");

const getAllUsersList = (request, response, next) => {
    fetchAllUsers()
    .then((users) => {
      response.status(200).json(users);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

const getUserById = (request, response, next) => {
    const {user_id} = request.params;
    fetchUserById(user_id)
    .then((user) => {
      response.status(200).json(user);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};




module.exports = { getAllUsersList, getUserById };