const {
  fetchAllCourses,
  CoursesRatingFunc,
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

module.exports = {
  getAllCourses,
  CoursesRatingService,
};
