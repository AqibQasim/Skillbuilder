const { logger } = require("../../logger");
const {
  getAllCourses,
  CoursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
} = require("../services/courseService");

const allCourses = async (request, reply) => {
  logger.info("data: ", request.body);
  try {
    const coursess = await getAllCourses();
    reply.send(coursess);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const coursesRating = async (request, reply) => {
  logger.info("data: ", request.body);
  try {
    const coursesRatingData = await CoursesRatingService();
    reply.send(coursesRatingData);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const courseDetails = async (request, reply) => {
  logger.info("data: ", request.body);
  try {
    const coursesDetailsRecieve = await coursesDetailFunc();
    reply.send(coursesDetailsRecieve);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const recentCourses = async (req, rep) => {
  logger.info("data: ", request.body);
  try {
    const recentCoursesRecieve = await recentCoursesFunc();
    reply.send(recentCoursesRecieve);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
  allCourses,
  coursesRating,
  courseDetails,
  recentCourses,
};
