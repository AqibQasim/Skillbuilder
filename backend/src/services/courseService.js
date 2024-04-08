const { logger } = require("../../logger");
const {
  fetchAllCourses,
  coursesRatingFunc,
  fetchCourseWithDetailsWithId,
  fetchAllRecentCourses,
  fetchAllRatings,
} = require("../repositories/courseRepository");

const getAllCourses = async () => {
  try {
    logger.info("src > services > getAllCourses");
    const CoursesReceive = await fetchAllCourses();
    console.log(CoursesReceive);
    return CoursesReceive;
  } catch (error) {
    return error;
  }
};

const coursesRatingService = async () => {
  logger.info("src > services > coursesRatingService");
  try {
    const CoursesRatingReceive = await coursesRatingFunc();

    return CoursesRatingReceive;
  } catch (error) {
    return error;
  }
};

const coursesDetailFunc = async (id) => {
  logger.info("Src > Services > coursesDetailFunc");
  try {
    const coursesDetailSave = await fetchCourseWithDetailsWithId(id);
    return coursesDetailSave;
  } catch (error) {
    return error;
  }
};

const recentCoursesFunc = async () => {
  logger.info("src > Services > recentCoursesFunc");
  try {
    const recentCoursesSave = await fetchAllRecentCourses();
    return recentCoursesSave;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllCourses,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
};
