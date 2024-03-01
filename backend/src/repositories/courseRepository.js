const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchAllCourses = async () => {
  const courseRepository = dataSource.getRepository("Course");
  const allCourses = await courseRepository
    .createQueryBuilder("course")
    .leftJoinAndSelect("course.reviews", "reviews")
    .getMany();

  return allCourses;
};

const CoursesRatingFunc = async () => {
  const courseRepository = dataSource.getRepository("Course");
  const courses_rating = await courseRepository
    .createQueryBuilder("course")
    .leftJoinAndSelect("course.reviews", "reviews")
    .orderBy("reviews.rating", "DESC")
    .getMany();
  return courses_rating;
};

const fetchAllCoursesWithDetails = async () => {
  const courseRepository = dataSource.getRepository("Course");
  const coursesWithDetails = await courseRepository
    .createQueryBuilder("course")
    .innerJoinAndSelect("course.instructor", "instructor")
    .leftJoinAndSelect("course.reviews", "reviews")
    .getMany();

  return coursesWithDetails;
};

const fetchAllRecentCourses = async () => {};

module.exports = {
  fetchAllCourses,
  CoursesRatingFunc,
  fetchAllCoursesWithDetails,
  fetchAllRecentCourses,
};
