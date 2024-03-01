const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const fetchSkills = async (instructorId) => {
  try {
    const skillRepository = dataSource.getRepository("Skills");
    logger.info("Skilss Repo ",skillRepository);
    const instructorSkills = await skillRepository.find({ where: { instructor_id:instructorId } });
    console.log("Instructor Repo ",instructorSkills)

    return instructorSkills;
  } catch (error) {
    throw new Error('Error fetching skills for instructor');
  }
};

module.exports = {
  fetchSkills,
};