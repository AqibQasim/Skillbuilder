const bcrypt = require("bcrypt");
const {
  adminSchema,
  updateInstructorRightsSchema,
} = require("../Schema/adminSchema");
const {
  createAdmin: createAdminRepo,
  verifyAdminCredentials,
} = require("../services/adminService");
const {
  updateInstructorRights,
} = require("../repositories/instructorRepository");
const jwt = require("jsonwebtoken");

const createAdmin = async (request, reply) => {
  try {
    // Validate request body
    const { error, value } = adminSchema.validate(request.body);
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const result = await createAdminRepo(value);

    return reply.code(201).send({
      status: 201,
      message: "Admin created successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error creating admin:", error);
    return reply.code(500).send({
      status: 500,
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
        status: 401,
        message: "Invalid credentials",
      });
    }

    // Generate JWT token
    const tokenPayload = {
      id: admin.id,
      username: admin.username,
      role: "admin",
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return reply.code(200).send({
      status: 200,
      message: "Login successful",
      data: {
        token,
        admin,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return reply.code(500).send({
      status: 500,
      message: "Internal server error",
    });
  }
};

const updateInstructorRightsController = async (request, reply) => {
  try {
    // Verify admin token
    const token = request.headers.authorization?.split(" ")[1];
    if (!token) {
      return reply.code(401).send({
        status: 401,
        message: "Admin authentication required",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role !== "admin") {
        return reply.code(403).send({
          status: 403,
          message: "Only admins can update instructor rights",
        });
      }
    } catch (error) {
      return reply.code(401).send({
        status: 401,
        message: "Invalid or expired token",
      });
    }

    // Validate request body
    const { error, value } = updateInstructorRightsSchema.validate(
      request.body
    );
    if (error) {
      return reply.code(400).send({
        status: 400,
        message: error.details[0].message,
      });
    }

    const { instructor_id, rights } = value;
    const updatedInstructor = await updateInstructorRights(
      instructor_id,
      rights
    );

    return reply.code(200).send({
      status: 200,
      message: "Instructor rights updated successfully",
      data: updatedInstructor,
    });
  } catch (error) {
    console.error("Error updating instructor rights:", error);
    return reply.code(500).send({
      status: 500,
      message: error.message || "Internal server error",
    });
  }
};

module.exports = {
  createAdmin,
  adminLogin,
  updateInstructorRightsController,
};
