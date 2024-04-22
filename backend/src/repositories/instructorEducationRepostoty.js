const dataSource = require("../../Infrastructure/postgres");
const instructorEducationRepository = dataSource.getRepository("instructor_education");
const { logger } = require("../../logger");

const createInstructorEducation = async (education) => {
  console.log("educations in respository: ", education);
  try {
    const creatingEducation = instructorEducationRepository.create(education);
    const data = instructorEducationRepository.save(creatingEducation);
    return data;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};



module.exports = {
  createInstructorEducation,
};
