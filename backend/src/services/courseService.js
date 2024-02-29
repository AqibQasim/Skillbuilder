const { fetchAllCourses } = require("../repositories/courseRepository");

const getAllCourses = async () => {
  console.log("Serviceeeeeeeeee");
  const coursesRecieve = await fetchAllCourses();
  return coursesRecieve;
};

module.exports = {
  getAllCourses,
};
