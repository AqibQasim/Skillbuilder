const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const { orderBy } = require("lodash");
const instructor = require("../entities/instructor");
const skills = require("../entities/skills");

const fetchAllInstructor = async () => {
  logger.info("src > instructorRepository > fetchAllInstructor");
  try {
    const courseRepository = dataSource.getRepository("instructor");
    const allInstructor = await courseRepository
      .createQueryBuilder("instructor")
      .select([
        "instructor.id AS id",
        "instructor.name AS name",
        "instructor.email AS email",
        "instructor.profile AS profile",
        "instructor.bio AS bio",
        "instructor.profession AS profession",
      ])
      .getRawMany();
    return allInstructor;
  } catch (error) {
    return error;
  }
};

const fetchAllInstructorWithSkills = async (id) => {
  logger.info("src > instructorRepository > fetchAllInstructorWithSkills");
  try {
    const instructorRepository = dataSource.getRepository("instructor");
    const instructor = await instructorRepository.findOne({
      where: { id },
      relations: ["skills","reviews"],
      select:["id", "name","email"]
    });
    console.log("instructorrrrr ------------- ",instructor);
    if (instructor) {
        return instructor;

    } else {
      return "Teacher Not Found With This ID";
    }
  } catch (error) {
    return error;
  }
};

module.exports = {
  fetchAllInstructor,
  fetchAllInstructorWithSkills,
};
