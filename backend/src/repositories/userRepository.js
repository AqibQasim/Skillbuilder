const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");


const createUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");
  const user = userRepository.create(userInfo);
  await userRepository.save(user);
  return user;
};

module.exports = {
  createUser,
};