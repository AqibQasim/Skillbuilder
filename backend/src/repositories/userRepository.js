const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const userRepository = dataSource.getRepository("User");
const bcrypt = require("bcrypt");



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
    const user = await userRepository.findOne({
      where: filter
    });
    return user ? user : null;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const findOneUser = async (id) => {
  console.log("id in find one user method:", id)
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOne({
      where: {
        id: id
      }
    });
    return user ? user : null;
  } catch(err){
    console.log("ERR:", err);
    return
  }
}

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
      return {
        status: false,
        message: "Email is incorrect"
      }
    } else {
      const passwordMatch = await bcrypt.compare(newData.current_password, user?.password);

      if (!passwordMatch) {
        return {
          status: false,
          message: "Password does not match"
        }
      } else {
        user.password = await bcrypt.hash(newData.new_password,10);
        //let update = await userRepository.merge(user, {password: new_password});
        let updatedUser = await userRepository.save(user);
        return {
          status: true,
          message: "Password updated successfully",
          userData: updatedUser
        };
      }

    }

    // let update = await userRepository.merge(user, newData);
    // let updatedUser = await userRepository.save(update);
    // return updatedUser;
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

    let update = userRepository.merge(user, payload);
    let updated = userRepository.save(update);
    console.log("updated data: ", update)
    if (update) {
      return {
        status: true,
        message: "Profile updated successfully",
        data: update
      }
    } else {
      throw new Error("Profile not updated");
    }
    // let update = await userRepository.merge(user, payload);
    // let updatedUser = await userRepository.save(update);
    // return updatedUser;
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
  findOneUser
};
