const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const userRepository = dataSource.getRepository("User");


const readAllUser = async () => {
  logger.info(['src > repository > userRepository > findAllUser' ]);
  try {
    const users = await userRepository.find();
    return users ? users : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

const createUser = async (userInfo) => {
  logger.info(['src > repository > userRepository > ', userInfo]);
  try {
    const userCreate = userRepository.create(userInfo);
    const result = await userRepository.save(userCreate);
    logger.info(["userResult", result])

  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

const findUser = async (filter) => {
  logger.info(['src > repository > userRepository > findUser' ]);
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne(filter);
    // logger.info([user]);
    return user ? user : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};


const UserContact = async (userInfo) => {
  const userRepository = dataSource.getRepository("Contact_us");
  console.log("User REpo", userRepository);

  try {
    const user = userRepository.create(userInfo);
    console.log("Users", user);
    const savedUser = await userRepository.save(user);
    return savedUser;
  } catch (error) {
    console.error("Error while creating user:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  readAllUser,
  findUser,
  UserContact,
};
