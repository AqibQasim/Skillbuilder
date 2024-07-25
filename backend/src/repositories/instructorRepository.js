const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const instructorRepository = dataSource.getRepository("instructor");

const instructorCreate = async (instructorPayload) => {
  logger.info("src > repositories > instructorRepositry");
  try {
    const creating = instructorRepository.create(instructorPayload);
    const result = instructorRepository.save(creating);
    console.log('instructor created:', result);
    return result;
  } catch (error) {
    logger.error("src repositories > instructorRepository");
    logger.error(error.message);
    throw Error(error);
  }
};

const fetchAllInstructor = async () => {
  logger.info("src > instructorRepository > fetchAllInstructor");
  try {
    // const courseRepository = dataSource.getRepository("instructor");
    // const allInstructor = await courseRepository
    //   .createQueryBuilder("instructor")
    //   .select(["instructor.id AS id", "instructor.name AS name", "instructor.email AS email", "instructor.profile AS profile", "instructor.bio AS bio", "instructor.profession AS profession"])
    //   .getRawMany();

    const allInstructor = await instructorRepository.find({
      relations: ["skills"],
      // select: ["id", "experience"],
    })

    if (allInstructor.length == 0) {
      return null;
    }
    return allInstructor;
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

  const findByFilter = async (filter) => {
    try {
      const instructorExist = await instructorRepository.findOne({
        ...filter,
        relations: ["skills", "reviews", "education"],
      });
      if (instructorExist) {
        return instructorExist;
      }
      return null;
    } catch (error) {
      logger.error(["src > reposirtory > instructorRepository > findByFilter > error", error.message]);
      throw new Error(error);
    }
  };

const updateInstructor = async (instructorId, videoUrl) => {
  const instructorExist = await instructorRepository.findOne({
    where: { id: instructorId },
  });

  if (!instructorExist) {
    return 'No such instructor exists!';
  };

  Object.assign(instructorExist, {video_url: videoUrl});

  const updatedInstructor = await instructorRepository.save(instructorExist);
  console.log("updated instructor:", updatedInstructor);
  return "Instructor has been updated successfully"
}

  // const fetchAllInstructorWithSkills = async (id) => {
  //   logger.info("src > instructorRepository > fetchAllInstructorWithSkills");
  //   try {
  //     const instructor = await instructorRepository.findOne({
  //       where: { id },
  //       relations: ["skills", "reviews", "education"],
  //       // select: ["id", "name", "email"],
  //     });
  //     console.log("instructorrrrr ------------- ", instructor);
  //     if (instructor) {
  //       return instructor;
  //     } else {
  //       return "Teacher Not Found With This ID";
  //     }
  //   } catch (error) {
  //     return error;
  //   }
  // };

module.exports = {
  instructorCreate,
  fetchAllInstructor,
  findByFilter,
  updateInstructor
  // fetchAllInstructorWithSkills,
};
