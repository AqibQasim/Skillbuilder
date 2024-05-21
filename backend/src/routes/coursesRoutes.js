const { postCourse, allCourses, coursesRating, courseDetails, recentCourses, getCourseById, createPurchasedCourse, getMyCourses } = require("../controllers/courseController");

const coursesRoutes = async (fastify, options) => {
  fastify.post("/create-course", postCourse);
  fastify.get("/get-one-course/:user_id", getCourseById);
  fastify.get("/all-courses", allCourses);
  fastify.get("/courses-rating", coursesRating);
  fastify.get("/recent-courses", recentCourses);
  fastify.get("/course-details/:id", courseDetails);
  fastify.post('/buy-course', createPurchasedCourse);
  fastify.get('/my-courses/:user_id', getMyCourses);
};

module.exports = coursesRoutes;
 