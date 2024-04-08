const {
  fetchAllInstructor,
  fetchAllInstructorWithSkills,
} = require("../repositories/instructorRepository");
const { logger } = require("../../logger");

const getInstructors = async (userInfo) => {
  try {
    logger.info("src > instructorServices > getAllInstructor");
    const InstructorReceive = await fetchAllInstructor();
    return InstructorReceive;
  } catch (error) {
    return error;
  }
};

const getInstructorsData = async (id) => {
  try {
    logger.info("src > instructorServices > getInstructorsData");
    const InstructorReceive = await fetchAllInstructorWithSkills(id);
    console.log("Service Instructor", InstructorReceive);
    return InstructorReceive;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getInstructors,
  getInstructorsData,
};
