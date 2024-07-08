const { logger } = require("../../logger");
const { createCourseContent } = require("../mediators/courseMediator");
const { uploadOnS3 } = require("../mediators/instructorMediator");
const { createCourse, findAllCourses, coursesRatingFunc, fetchCourseWithDetailsWithId, fetchAllRecentCourses, findOneCourse  } = require("../repositories/courseRepository");
const {getAllReviews} =  require("../repositories/courseReviewRepository.js");
const {saveReview} = require("../repositories/courseReviewRepository.js");

const createCourseWithDetails = async (requestedData) => {
  try {
    const { instructor_id, title, creation_duration_hours, learning_outcomes, category, modulesCount, amount, image, modules } = requestedData;
    // const image_url = await uploadOnS3(image);
    const courseBasicsPayload = {
      instructor_id,
      title,
      creation_duration_hours,
      learning_outcomes,
      category,
      modulesCount,
      amount,
      discount: requestedData?.discount,
      charges: amount * 0.03,
      image: image,
      created_at: new Date(),
    };
    let courseBasics = await createCourse(courseBasicsPayload);
    console.log("courseBasics: ", courseBasics);
    await createCourseContent(modules, courseBasics.id);
  } catch (error) {
    logger.error("src > services > courseService > error");
    logger.error(error);
    throw new Error(error);
  }
};

const getAllCourses = async () => {
  try {
    logger.info("src > services > getAllCourses");
    const CoursesReceive = await findAllCourses();
    console.log(CoursesReceive);
    return CoursesReceive;
  } catch (error) {
    return error;
  }
};

const courseGetById = async (id) => {
  try {
    let filter = {
      where: {
        id: id,
      },
    };
    const result = await findOneCourse(filter);
    return result;
  } catch (error) {
    logger.error("src > services > courseService")
    logger.error(error);
    throw new Error(error.message);
  }
};

const coursesRatingService = async () => {
  logger.info("src > services > coursesRatingService");
  try {
    const CoursesRatingReceive = await coursesRatingFunc();

    return CoursesRatingReceive;
  } catch (error) {
    return error;
  }
};

const coursesDetailFunc = async (id) => {
  logger.info("Src > Services > coursesDetailFunc");
  try {
    const coursesDetailSave = await fetchCourseWithDetailsWithId(id);
    return coursesDetailSave;
  } catch (error) {
    return error;
  }
};

const recentCoursesFunc = async () => {
  logger.info("src > Services > recentCoursesFunc");
  try {
    const recentCoursesSave = await fetchAllRecentCourses();
    return recentCoursesSave;
  } catch (error) {
    return error;
  }
};

const postReviewService = async (data) => {
  try{
    const postReview = await saveReview(data);
    return postReview;
  } catch(e) {
    console.log("ERR:",e);
  }
};


const getReviewsService = async (id) => {
  try{
    const getReviews = await getAllReviews(id);
    return getReviews;
  } catch(e) {
    console.log("ERR:",e);
  }
}

module.exports = {
  createCourseWithDetails,
  getAllCourses,
  courseGetById,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
  postReviewService,
  getReviewsService
};
