const { postCourse, allCourses, coursesRating, courseDetails, recentCourses, getCourseById, createPurchasedCourse, getMyCourses, postReview, getReviews, uploadCourseIntroVideo, uploadCourseContent , updateCourseProperties, declineCourse} = require("../controllers/courseController");
const { createCourseSchema, getCourseByIdSchema, allCoursesSchema, coursesRatingSchema, recentCoursesSchema, courseDetailsSchema, myCoursesSchema, buyCourseSchema } = require("../Schema/courseSchema")
const coursesRoutes = async (fastify, options) => {
  fastify.post("/create-course", createCourseSchema, postCourse);
  fastify.get("/get-one-course/:id", getCourseByIdSchema, getCourseById);
  fastify.get("/all-courses", allCoursesSchema, allCourses);
  fastify.get("/courses-rating", coursesRatingSchema, coursesRating);
  fastify.get("/recent-courses", recentCoursesSchema, recentCourses);
  fastify.get("/course-details/:id", courseDetailsSchema, courseDetails);
  fastify.post('/buy-course',buyCourseSchema, createPurchasedCourse);
  fastify.get('/my-courses/:user_id', myCoursesSchema, getMyCourses);
  fastify.post('/post-review', postReview);
  fastify.get('/get-all-reviews/:id', getReviews);
  fastify.post("/upload-course-intro", uploadCourseIntroVideo);
  fastify.post("/upload-course-content", uploadCourseContent);
  fastify.put("/set-course-prop",updateCourseProperties);
  fastify.put("/decline-course",declineCourse);
  // fastify.post("")
};

module.exports = coursesRoutes;
  