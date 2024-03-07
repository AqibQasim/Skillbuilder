const { createUser } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  try {
    const user = await createUser(userInfo);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error registering user");
  }
};

module.exports = {
  registerUser,
};
