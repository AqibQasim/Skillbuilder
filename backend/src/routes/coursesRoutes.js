const {
  postCourse,
  allCourses,
  coursesRating,
  courseDetails,
  recentCourses,
  getCourseById,
  createPurchasedCourse,
  getMyCourses,
  postReview,
  getReviews,
  uploadCourseIntroVideo,
  uploadCourseContent,
  updateCourseProperties,
  setCourseStatus,
  allStudentCourses,
  getIsCoursePurchased,
  saveProgressController,
  getSavedModuleProgressController,
  getCourseCompletionProgressController,
  getTopSellingCourses,
} = require("../controllers/courseController");
const {
  createCourseSchema,
  getCourseByIdSchema,
  allCoursesSchema,
  coursesRatingSchema,
  recentCoursesSchema,
  courseDetailsSchema,
  myCoursesSchema,
  buyCourseSchema,
  getreviewSchema,
  updatecourseSchema,
  courseStatusSchema,
  postSchema,
} = require("../Schema/courseSchema");
const {
  checkCourseRights,
  COURSE_TYPES,
} = require("../middleware/checkCourseRights");

const coursesRoutes = async (fastify, options) => {
  // Regular course creation
  fastify.post(
    "/create-course",
    {
      schema: createCourseSchema,
      preHandler: [checkCourseRights(COURSE_TYPES.REGULAR)],
    },
    postCourse
  );
  fastify.get("/get-one-course/:id", getCourseByIdSchema, getCourseById);
  fastify.get("/all-courses", allCoursesSchema, allCourses);
  fastify.get("/student/all-courses", allCoursesSchema, allStudentCourses);
  fastify.get("/courses-rating", coursesRatingSchema, coursesRating);
  fastify.get("/recent-courses", recentCoursesSchema, recentCourses);
  fastify.get("/course-details/:id", courseDetailsSchema, courseDetails);
  fastify.post("/buy-course", buyCourseSchema, createPurchasedCourse);
  fastify.get("/my-courses/:user_id", myCoursesSchema, getMyCourses);
  fastify.post("/post-review", postSchema, postReview);
  fastify.get("/get-all-reviews/:id", getreviewSchema, getReviews);
  fastify.get("/get-all-reviews", getReviews);
  fastify.post("/upload-course-intro", uploadCourseIntroVideo);
  fastify.post("/upload-course-content", uploadCourseContent);
  fastify.put("/set-course-prop", updatecourseSchema, updateCourseProperties);
  fastify.put("/set-course-status", courseStatusSchema, setCourseStatus);
  fastify.get("/is-course-purchased", getIsCoursePurchased);
  fastify.put("/save-progress", saveProgressController);
  fastify.get(
    "/get-saved-module-progress-of-student",
    getSavedModuleProgressController
  );
  fastify.get(
    "/get-course-completion-progress",
    getCourseCompletionProgressController
  );
  fastify.get(
    "/get-top-selling-courses",
    allCoursesSchema,
    getTopSellingCourses
  );
  //fastify.post("/authorize-user-yt", getUserAuthorizedByYT);
};

module.exports = coursesRoutes;
