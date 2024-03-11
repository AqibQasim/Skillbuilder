const {
  ReadInstructors,
  getInstructorWithReviewsAndUsers,
} = require("../services/instructorService");
const { logger } = require("../../logger");

const fetchInstructorWithRevieww = async (req, reply) => {
  try {
    const id = req.params.id;
    logger.info("checkinggggggggggggg");
    const instructorWithSkills = await getInstructorWithReviewsAndUsers(id);
    console.log("Data Controller ", instructorWithSkills);
    reply.send(instructorWithSkills);
  } catch (error) {
    reply.code(500).send(error.message);
  }
};

const getInstructors = async (req, reply) => {
  try {
    const instructors = await ReadInstructors();
    reply.send(instructors);
  } catch (err) {
    reply.code(500).send(err);
  }
};

module.exports = { getInstructors, fetchInstructorWithRevieww };
