const adminController = require("../controllers/adminController");

const adminRoutes = async (fastify, options) => {
  fastify.post("/admin-login", adminController.adminLogin);
  fastify.post("/admin-signup", adminController.createAdmin);
  fastify.patch(
    "/update-instructor-rights",
    adminController.updateInstructorRightsController
  );
};

module.exports = adminRoutes;
