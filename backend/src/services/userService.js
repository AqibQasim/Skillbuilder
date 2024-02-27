const {
  createUser,
  signInUserFunc,
} = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

const signInUser = async (userInfo) => {
  return await signInUserFunc(userInfo);
};

module.exports = {
  registerUser,
  signInUser,
};
