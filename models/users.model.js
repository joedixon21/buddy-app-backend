const  mongoose  = require('mongoose');

const UserSchema = mongoose.Schema({
    user_id: {
        type:Number,
        required:false,
        index: { unique: true }
    },
    display_name: {
        type:String,
        required:true,
    },
    password: {
        type:String,
        required:true,
    },
    user_access: {
        type:Number,
        required:false,
    }
}
);

const User = mongoose.model("User", UserSchema);

const fetchAllUsers = () => {
    return User.find({}).then((Users) => {
      return Users;
    });
  };

const fetchUserById = (user_id) => {
   if (isNaN(user_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }
    return User.findOne({user_id}).then((user) => {
        if (!user) {
            return Promise.reject({ status: 404, msg: "Not Found" });
          }
          return user;
      });
}
module.exports = { fetchAllUsers, fetchUserById };






