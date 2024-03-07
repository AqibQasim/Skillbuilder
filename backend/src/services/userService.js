const { createUser } = require("../repositories/userRepository");

const registerUser = async (userInfo) => {
  try {
    // Create user
    const user = await createUser(userInfo);

    // If user object is not null, remove the password property
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      // Handle the case when user creation fails
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
