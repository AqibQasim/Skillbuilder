const {
  getInstructors,
  getInstructorsData,
} = require("../services/instructorService.js");
const { logger } = require("../../logger");

const getAllInstructor = async (request, reply) => {
  logger.info("src > InstructorController > getAllCourses ", request.body);
  try {
    const InstructorData = await getInstructors();
    if (InstructorData) {
      reply.code(200).send({
        status: "Success",
        InstructorData: InstructorData,
      });
    } else {
      reply.code(400).send({
        status: "failed",
        message: message,
        courses: null,
      });
    }
  } catch (error) {
    reply.status(500).send(error);
  }
};

const instructorDetail = async (request, reply) => {
    logger.info("src > InstructorController > instructorDetail ", request.params);
    try {
      const id = request.params.id;
      const instructorData = await getInstructorsData(id);
      console.log("Instructor Data:", instructorData);
      if (instructorData) {
        reply.code(200).send({
          status: "Success",
          InstructorData: instructorData,
        });
      } else {
        reply.code(400).send({
          InstructorData: null,
          status: "Failed",
          message: "Instructor not found with the provided ID",
        });
      }
    } catch (error) {
      logger.error("Error occurred:", error);
      reply.status(500).send({
        message: "Internal Server Error",
      });
    }
  };
  

module.exports = {
  getAllInstructor,
  instructorDetail,
};
