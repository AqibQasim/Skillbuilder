const { logger } = require("../../logger");
const {
  getAllCourses,
  coursesRatingService,
  coursesDetailFunc,
  recentCoursesFunc,
} = require("../services/courseService");

const allCourses = async (request, reply) => {
  logger.info("src > controller > controllerALlrCourse ", request.body);
  try {
    const courses = await getAllCourses();
    if (courses) {
      reply.code(200).send({
        courses: courses,
        status: "Success",
      });
    } else {
      reply.code(400).send({
        courses: null,
        status: "failed",
        message: message,
      });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

const coursesRating = async (request, reply) => {
  logger.info("src > controller > coursesRating", request.body);
  try {
    const CoursesRatingData = await coursesRatingService();

    console.log(CoursesRatingData);

    if (CoursesRatingData) {
      reply.send({
        code: 200,
        status: "Success",
        CoursesRatingData: CoursesRatingData,
      });
    } else {
      reply.send({
        code: 400,
        status: "Failed",
        CoursesRatingData: null,
      });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

const courseDetails = async (request, reply) => {
  logger.info("src > Controller > courseDetails ", request.body);
  try {
    const { id } = request.params;
    const coursesDetailsReceive = await coursesDetailFunc(id);

    if (coursesDetailsReceive) {
      reply.code(200).send({
        status: "Success",
        coursesDetailsReceive: coursesDetailsReceive,
      });
    } else {
      reply.code(400).send({
        status: "Failed",
        CoursesDetailsReceive: null,
      });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

const recentCourses = async (request, reply) => {
  logger.info("Src > Controller > recentCourses", request.body);
  try {
    const RecentCoursesReceive = await recentCoursesFunc();
    if (RecentCoursesReceive)
      reply.code(200).send({
        RecentCoursesReceive: RecentCoursesReceive,
      });
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
