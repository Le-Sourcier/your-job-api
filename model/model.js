//User registration model
const register = require("./components/register_model");

//User authentification model
const login = require("./components/login_model");

//Get user data model
const getUser = require("./components/user_model");

const deleteUser = require("./components/delete_user_model");
const updateUser = require("./components/update_user_data");

module.exports = { register, login, getUser, deleteUser, updateUser };
