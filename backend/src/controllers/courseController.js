const { logger } = require("../../logger");
const { createCourseWithDetails, getAllCourses, coursesRatingService, coursesDetailFunc, recentCoursesFunc, courseGetById, postReviewService, getReviewsService } = require("../services/courseService");
const { getInstructorById } = require("../services/instructorService");
const { postPurchasedCourse, findAllPurchasedCourse } = require("../services/purchasedCourseService");

const postCourse = async (request, reply) => {
  try {
    if (request?.body) {
      const data = request.body;
      console.log("body", data);
      const instructor_id = data.instructor_id;
      const isInstructorExist = await getInstructorById(instructor_id);
      if (isInstructorExist == null) {
        throw new Error("instructor not exist");
      }
      await createCourseWithDetails(data);
      reply.send({
        status: true,
        message: "course has been created succesfully", 
      });
    } else {
      reply.code(400).send({
        status: false,
        message: "Cannot request without body",
      });
    }
  } catch (error) {
    logger.error(error);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const allCourses = async (request, reply) => {
  logger.info("src > controller > controllerALlrCourse ", request.body);
  try {
    console.log('req body:',request?.body);
    const courses = await getAllCourses();
    console.log('courses:',courses);
    // if (courses) {
      return reply.status(200).send({
        status: true,
        message: "success",
        data: courses,
      });
    // } else {
    //   return reply.status(200).send({
    //     status: true,
    //     message: "success",
    //     data: null,
    //   });
    // }
  } catch (error) {
    logger.error(error);
    reply.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getCourseById = async (request, reply) => {
  try {
    const id = request.params.id;
    const data = await courseGetById(id);
    reply.send({
      status: true,
      message: "success",
      data: data,
    });
  } catch (error) {
    logger.error("src > controllers > courseController");
    logger.error(error);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const coursesRating = async (request, reply) => {
  logger.info("src > controller > coursesRating", request.body);
  try {
    const CoursesRatingData = await coursesRatingService();
    reply.code(200).send({
      status: true,
      message: "success",
      data: CoursesRatingData,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
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
    reply.code(200).send({
      status: true,
      message: "success",
      data: RecentCoursesReceive,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const createPurchasedCourse = async (request, reply) => {
  try {
    const body = request.body;
    const result = await postPurchasedCourse(body);
    if (result) {
      reply.code(200).send({
        status: true,
        message: result,
      });
    }
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getMyCourses = async (request, reply) => {
  try {
    const { user_id } = request.params;
    const result = await findAllPurchasedCourse(user_id);
    reply.code(200).send({
      status: true,
      message: "success",
      data: result,
    });
  } catch (error) {
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const postReview = async (req, res) => {
  try{
    const data = req?.body;
    const result = await postReviewService(data);
    console.log("result of posting a review:", result);
    res.code(200).send({
      success: true,
      message: result
    })
  }

  catch(e){
    console.log("ERR:",e);
  }
}

const getReviews = async (req, res) => {
  const id = req?.params?.id;
  const result = await getReviewsService(id);
    console.log("result of posting a review:", result);
    res.code(200).send({
      success: true,
      message: result
    })
}

module.exports = {
  postCourse,
  allCourses,
  getCourseById,
  coursesRating,
  courseDetails,
  recentCourses,
  createPurchasedCourse,
  getMyCourses,
  postReview,
  getReviews
};
