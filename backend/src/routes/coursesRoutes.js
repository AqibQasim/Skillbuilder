const { postCourse, allCourses, coursesRating, courseDetails, recentCourses, getCourseById, createPurchasedCourse, getMyCourses, postReview } = require("../controllers/courseController");
const { createCourseSchema, getCourseByIdSchema, allCoursesSchema, coursesRatingSchema, recentCoursesSchema, courseDetailsSchema, myCoursesSchema, buyCourseSchema } = require("../Schema/courseSchema")
const coursesRoutes = async (fastify, options) => {
  fastify.post("/create-course",createCourseSchema, postCourse);
  fastify.get("/get-one-course/:id", getCourseByIdSchema, getCourseById);
  fastify.get("/all-courses", allCoursesSchema, allCourses);
  fastify.get("/courses-rating", coursesRatingSchema, coursesRating);
  fastify.get("/recent-courses", recentCoursesSchema, recentCourses);
  fastify.get("/course-details/:id", courseDetailsSchema, courseDetails);
  fastify.post('/buy-course',buyCourseSchema, createPurchasedCourse);
  fastify.get('/my-courses/:user_id', myCoursesSchema, getMyCourses);
  fastify.post('/post-review', postReview)
};

module.exports = coursesRoutes;
 