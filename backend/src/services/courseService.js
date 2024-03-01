const {
  fetchAllCourses,
  CoursesRatingFunc,
  fetchAllCoursesWithDetails,
  fetchAllRecentCourses,
} = require("../repositories/courseRepository");

const getAllCourses = async () => {
  console.log("Serviceeeeeeeeee");
  const coursesRecieve = await fetchAllCourses();
  return coursesRecieve;
};

const CoursesRatingService = async () => {
  //console.log("Serviceeeeeeeeee");
  const coursesRatingRecieve = await CoursesRatingFunc();
  return coursesRatingRecieve;
};

const coursesDetailFunc = async () => {
  const coursesDetailSave = await fetchAllCoursesWithDetails();
  return coursesDetailSave;
};

const recentCoursesFunc = async () => {
  const recentCoursesSave = await fetchAllRecentCourses();
  return recentCoursesSave;
};

module.exports = {
  getAllCourses,
  CoursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
};
