const {
  getInstructors,
  getInstructorById,
  createNewInstructor,
  getCoursesByInstService
} = require("../services/instructorService.js");
const { logger } = require("../../logger");

const createInstructor = async (request, reply) => {
  try {
    logger.info("src > controllers > InstructorController > createInstructor");
    // const body = JSON.parse(request.body);
    logger.info(request?.body);
    await createNewInstructor(request?.body);
    reply.send({
      status: true,
      message: "create instructor successfully ",
    });
  } catch (error) {
    logger.error(error.message);
    reply.code(500).send({
      status: false,
      message: error.message,
    });
  }
};

const getAllInstructor = async (request, reply) => {
  logger.info("src > InstructorController > getAllInstructors ");
  try {
    const InstructorData = await getInstructors();
    if (InstructorData) {
      reply.code(200).send({
        status: true,
        message: "success",
        data: InstructorData,
      });
    } else {
      reply.code(400).send({
        status: false,
        message: "No Instructors found ",
      });
    }
  } catch (error) {
    reply.status(500).send({
      status: false,
      message: error.message,
    });
  }
};

const instructorDetail = async (request, reply) => {
  logger.info("src > InstructorController > instructorDetail ", request.params);
  try {
    const id = request.params.id;
    const instructorData = await getInstructorById(id);
    console.log("Instructor Data:", instructorData);
    if (instructorData) {
      reply.code(200).send({
        status: true,
        data: instructorData,
      });
    } else {
      reply.code(404).send({
        status: false,
        message: "Instructor not found with the provided ID",
      });
    }
  } catch (error) {
    logger.error("Error occurred in instructor controller :", error.message);
    reply.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getCoursesByInstructor = async (request, reply) => {
  try {
    const id = request?.params?.id;
    const allCoursesByInstructor = await getCoursesByInstService(id);
    reply.status(200).send(allCoursesByInstructor);
  } catch (e) {
    console.log("ERR:", e);
    reply.status(500).send("Some server side exception has occured");
  }
}

module.exports = {
  createInstructor,
  getAllInstructor,
  instructorDetail, 
  getCoursesByInstructor
};
