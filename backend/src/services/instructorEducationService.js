const { logger } = require("../../logger");
const { createInstructorEducation } = require("../repositories/instructorEducationRepostoty");

const educationInstuctorCreate = async (educations, instructor_id) => {
  logger.info("src > services > instructorService");
  try {
    for (const education of educations) {
      await createInstructorEducation({ ...education, instructor_id });
    }
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};

module.exports = {
  educationInstuctorCreate,
};
