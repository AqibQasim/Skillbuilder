const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
//const { generateToken } = require("../");

const createUser = async (userInfo) => {
  const userRepository = dataSource.getRepository("User");
  const user = userRepository.create(userInfo);
  await userRepository.save(user);
  return user;
};

const findUser = async (userInfo) => {
  const { email, password } = userInfo;

  const userRepository = dataSource.getRepository("User");

  try {
    // const userFound = await userRepository.findOne({ where: { email } });

    const userFound = await userRepository.query(
      "SELECT * FROM curd_db WHERE email = $1",
      [email]
    );

    if (userFound && (await bcrypt.compare(password, userFound[0].password))) {
      const Token = jwt.sign(userFound[0], "secret123", {
        expiresIn: "30d",
      });

      userInfo.authenticatedToken = Token;

      return { userFound, Token };
    } else {
      return "Invalid credentials";
    }
  } catch (err) {
    throw new Error("Unable to login");
  }
};

module.exports = {
  createUser,
  findUser,
};
