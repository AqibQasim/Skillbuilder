const { logger } = require("../../logger");
const { createInstructorSkills } = require("../repositories/instructorSkillsRepository");

const skillsInstuctorCreate = async (skills, instructor_id) => {
  logger.info("src > services > instructorService");
  try {
    for (const skill of skills) {
      await createInstructorSkills({ ...skill, instructor_id });
    }
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};

module.exports = {
    skillsInstuctorCreate
}