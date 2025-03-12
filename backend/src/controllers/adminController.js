const bcrypt = require("bcrypt");
const { adminSchema } = require("../Schema/adminSchema");
const {
  createAdmin: createAdminRepo,
  verifyAdminCredentials,
} = require("../repositories/adminRepository");

const createAdmin = async (request, reply) => {
  try {
    // Validate request body
    const { error, value } = adminSchema.validate(request.body);
    if (error) {
      return reply.code(400).send({
        status: false,
        code: 400,
        message: error.details[0].message,
      });
    }

    const result = await createAdminRepo(value);

    return reply.code(201).send({
      status: true,
      code: 201,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return reply.code(500).send({
      status: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

const adminLogin = async (request, reply) => {
  try {
    const { username, password } = request.body;

    const admin = await verifyAdminCredentials(username, password);

    if (!admin) {
      return reply.code(401).send({
        status: false,
        code: 401,
        message: "Invalid credentials",
      });
    }

    // TODO: Generate JWT token here if needed

    return reply.code(200).send({
      status: true,
      code: 200,
      message: "Login successful",
      data: admin,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return reply.code(500).send({
      status: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
};
