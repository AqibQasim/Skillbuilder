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
    .leftJoinAndSelect("course.reviews", "reviews")
    .select(["course", "reviews.rating"])
    .getMany();
  return allCourses;
};

const CoursesRatingFunc = async () => {
  const courseRepository = dataSource.getRepository("Course");
  const courses_rating = await courseRepository
    .createQueryBuilder("course")
    .leftJoinAndSelect("course.reviews", "reviews")
    .select(["course", "reviews.rating"])
    .orderBy("reviews.rating", "DESC")
    .getMany();
  return courses_rating;
};
// Example usage
module.exports = {
  fetchAllCourses,
  CoursesRatingFunc,
};
