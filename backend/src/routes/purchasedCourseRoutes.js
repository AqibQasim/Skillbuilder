const {
  getPurchasedCourse,
  userpurchasedCourse,
} = require("../controllers/purchasedCourseController");

const purchaseCourseRoutes = async (fastify, options) => {
  fastify.get("/purchased-course", getPurchasedCourse);
  fastify.get("/user-purchased-course/:id", userpurchasedCourse);
};

module.exports = purchaseCourseRoutes;
