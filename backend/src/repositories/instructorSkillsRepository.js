const dataSource = require("../../Infrastructure/postgres");
const instructorSkillsRepository = dataSource.getRepository("instructor_skills");
const { logger } = require("../../logger");

const createInstructorSkills = async (skills) => {
  console.log("skill in respository: ", skills);
  try {
    const creatingSkills = instructorSkillsRepository.create(skills);
    const data = instructorSkillsRepository.save(creatingSkills);
    return data;
  } catch (error) {
    logger.error(error.message);
    throw new Error(error);
  }
};

module.exports = {
  createInstructorSkills,
};
