const dataSource = require("../../Infrastructure/postgres");
const { verifyPassword } = require("../mediators/userMediator");
const admin = dataSource.getRepository("admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const verifyAdmin = async (username, password) => {
  const isAdminExist = await admin.findOne({
    where: {
      username,
    },
  });
  if (admin) {
    const passwordMatch = await bcrypt.compare(
      password,
      isAdminExist?.password
    );
    if (!passwordMatch) {
      return {
        status: 401,
        message: "Password does not match",
      };
    }

    const tokenPayload = {
      id: isAdminExist?.id,
      username: isAdminExist?.username,
      role: "admin",
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET);
    const option = {
      headers: {
        "Set-Cookie": cookie.serialize("token", token, {
          // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        }),
      },
    };
    return {
      status: 200,
      message: "admin logged in successfully",
      data:{
        username: isAdminExist.username,
        id: isAdminExist?.id,
        token: token,
        adminOptions: option
      }
    };
  }
};
