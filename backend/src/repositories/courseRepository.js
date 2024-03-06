const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchAllCourses = async () => {
  logger.info("src > Repository > fetchAllCourses");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const allCourses = await courseRepository
      .createQueryBuilder("course")
      .leftJoinAndSelect("course.reviews", "reviews")
      .getMany();
    return allCourses;
  } catch (error) {
    return error;
  }
};

const coursesRatingFunc = async () => {
  logger.info("Src > Repository > coursesRatingFunc")
  try{
  const courseRepository = dataSource.getRepository("Course");
  const courses_rating = await courseRepository
    .createQueryBuilder("course")
    .leftJoinAndSelect("course.reviews", "reviews")
    .orderBy("reviews.rating", "DESC")
    .getMany();
  return courses_rating;
  }catch(error){
    return error
  }
};

const fetchAllCoursesWithDetails = async () => {
  logger.info("Src > Repository > fetchAllCoursesWithDetails")
  try{
  const courseRepository = dataSource.getRepository("Course");
  const coursesWithDetails = await courseRepository
    .createQueryBuilder("course")
    .innerJoinAndSelect("course.instructor", "instructor")
    .leftJoinAndSelect("course.reviews", "reviews")
    .getMany();
    console.log("Courses in Repository ",coursesWithDetails)
  return coursesWithDetails;
  }catch(error){
    return error
  }
};

const fetchAllRecentCourses = async () => {
  logger.info("src > Repository > fetchAllRecentCourses");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const coursesWithUpdatedTime = await courseRepository
      .createQueryBuilder("course")
      .innerJoinAndSelect("course.instructor", "instructor")
      .leftJoinAndSelect("course.reviews", "reviews")
      .orderBy("course.updated_at", "DESC") // Corrected: should be "DESC" for most recent first
      .getMany();

    return coursesWithUpdatedTime;
  } catch (error) {
    return error;
  }
};


module.exports = {
  fetchAllCourses,
  coursesRatingFunc,
  fetchAllCoursesWithDetails,
  fetchAllRecentCourses,
};
