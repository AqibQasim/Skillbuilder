const { logger } = require("../../logger");
const {
  fetchAllCourses,
  coursesRatingFunc,
  fetchAllCoursesWithDetails,
  fetchAllRecentCourses,
} = require("../repositories/courseRepository");

const getAllCourses = async () => {
  try{
  logger.info("src > services > getAllCourses")
  const CoursesReceive = await fetchAllCourses();
  return CoursesReceive;
  }
  catch(error){
    return error
  }
};

const coursesRatingService = async () => {
  logger.info("src > services > coursesRatingService")
  try{
  const CoursesRatingReceive = await coursesRatingFunc();
  return CoursesRatingReceive;
  }
  catch(error){
    return error
  }
};

const coursesDetailFunc = async () => {
  logger.info("Src > Services > coursesDetailFunc")
  try{
  const coursesDetailSave = await fetchAllCoursesWithDetails();
  console.log("Courses Detail Save in Service",coursesDetailSave)
  return coursesDetailSave;
  }
  catch(error){
    return error
  }
};

const recentCoursesFunc = async () => {
  logger.info("src > Services > recentCoursesFunc")
  try{
  const recentCoursesSave = await fetchAllRecentCourses();
  return recentCoursesSave;
  }
  catch(error){
    return error
  }
};

module.exports = {
  getAllCourses,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
};
