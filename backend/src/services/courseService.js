const {
  fetchAllCourses,
  CoursesRatingFunc,
  fetchAllCoursesWithDetails,
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
  const coursesRatingRecieve = await fetchAllCoursesWithDetails();
  return coursesRatingRecieve;
};

module.exports = {
  getAllCourses,
  CoursesRatingService,
  coursesDetailFunc,
};
