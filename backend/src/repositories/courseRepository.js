const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchAllCourses = async () => {
  logger.info("src > Repository > fetchAllCourses");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const allCourses = await courseRepository.find();
    return allCourses;
  } catch (error) {
    return error;
  }
};

const coursesRatingFunc = async () => {
  logger.info("Src > Repository > coursesRatingFunc");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const courses_rating = await courseRepository.find({
      order: {
        rating: "DESC",
      },
    });

    return courses_rating;
  } catch (error) {
    return error;
  }
};

const fetchCourseWithDetailsWithId = async (id) => {
  logger.info("Src > Repository > fetchAllCoursesWithDetails");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const coursesWithDetails = await courseRepository
      .createQueryBuilder("course")
      .where("course.id = :id", { id })
      .leftJoinAndSelect("course.course_content", "course_content")
      .leftJoinAndSelect("course.instructor", "instructor")
      .leftJoinAndSelect("course.reviews", "reviews")
      .leftJoinAndSelect("reviews.user", "user")
      .select([
        "course.id",
        "course.amount",
        "course.title",
        "course.description",
        "course.discount",
        "course.active",
        "course.image",
        "course.rating",
        "course.created_at",
        "course.updated_at",
        "course.created_by",
        "course.updated_by",
        "course_content.id",
        "course_content.content_type",
        "course_content.content",
        "course_content.order",
        "instructor.id",
        "instructor.name",
        "instructor.email",
        "instructor.bio",
        "instructor.profession",
        "reviews.id",
        "reviews.rating",
        "reviews.comment",
        "reviews.date",
        "user.id",
        "user.name",
        "user.email",
        "user.active",
      ])
      .getOne();

    console.log(coursesWithDetails);
    return coursesWithDetails;
  } catch (error) {
    return error;
  }
};

const fetchAllRecentCourses = async () => {
  logger.info("src > Repository > fetchAllRecentCourses");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const coursesWithUpdatedTime = await await courseRepository.find({
      order: {
        updated_at: "DESC",
      },
    });

    return coursesWithUpdatedTime;
  } catch (error) {
    return error;
  }
};

module.exports = {
  fetchAllCourses,
  coursesRatingFunc,
  fetchCourseWithDetailsWithId,
  fetchAllRecentCourses,
};