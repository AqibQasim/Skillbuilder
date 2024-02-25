const { createUser } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  return await createUser(userInfo);
};

module.exports = {
  registerUser,
};