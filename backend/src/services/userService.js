const { createUser, findUser } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

const signInUser = async (userInfo) => {
  return await findUser(userInfo);
};

module.exports = {
  registerUser,
  signInUser,
};
