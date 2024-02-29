/* const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const { Course } = require("../entities/course");

const fetchAllCourses = async () => {
  try {
    const courseRepository = dataSource.getRepository(Course);
    const courses = await courseRepository
      .createQueryBuilder("course")
      .innerJoin("course.instructors", "instructor")
      .getMany();

    return courses;
  } catch (error) {
    logger.error(error.message);
    throw error;
  }
};

module.exports = {
  fetchAllCourses,
};
 */

const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchAllCourses = async () => {
  const courseRepository = dataSource.getRepository("Course");
  const allCourses = await courseRepository
    .createQueryBuilder("course")
    .innerJoinAndSelect("course.instructor", "instructor")
    .getMany();
  return allCourses;
};

// Example usage
module.exports = {
  fetchAllCourses,
};
