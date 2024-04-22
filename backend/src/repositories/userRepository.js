const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const userRepository = dataSource.getRepository("User");

const createUser = async (userInfo) => {
  logger.info(["src > repository > userRepository > ", userInfo]);
  try {
    const userCreate = userRepository.create(userInfo);
    const result = await userRepository.save(userCreate);
    logger.info(["user created", result]);
    return result;
  } catch (error) {
    logger.error("Error while creating user:", error);
    throw error;
  }
};

const readAllUser = async () => {
  logger.info(["src > repository > userRepository > findAllUser"]);
  try {
    const users = await userRepository.find();
    return users ? users : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const findUser = async (filter) => {
  logger.info(["src > repository > userRepository > findUser"]);
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

const updateUserByEmail = async (email, newData) => {
  try {
    console.log("email", email);
    console.log("password: ", newData);
    const user = await userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }

    let update = await userRepository.merge(user, newData);
    let updatedUser = await userRepository.save(update);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
};

const updateUserById = async (id, payload) => {
  try {
    console.log("id", id);
    console.log("payload: ", payload);
    const user = await userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw Error("User not found");
    }

    let update = await userRepository.merge(user, payload);
    let updatedUser = await userRepository.save(update);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
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
  updateUserByEmail,
  updateUserById,
  UserContact,
};
