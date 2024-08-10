const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const instructorRepository = dataSource.getRepository("instructor");
const userRepository = dataSource.getRepository("User");
const { skillsInstuctorCreate } = require("../services/instructorSkillService");
const {
  educationInstuctorCreate,
} = require("../services/instructorEducationService");

const instructorCreate = async (instructorPayload) => {
  logger.info("src > repositories > instructorRepositry");
  try {
    const creating = instructorRepository.create(instructorPayload);
    const result = await instructorRepository.save(creating);
    console.log(
      "instructor created:",
      result,
      "***********************************"
    );
    const userId = result?.id;
    console.log("result.id is:", result?.id);
    await skillsInstuctorCreate(instructorPayload?.skills, result?.id);
    await educationInstuctorCreate(
      instructorPayload?.qualifications,
      result?.id
    );
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
    const user= await dataSource.getRepository("User").find();
    //console.log(user)
    
    const allInstructor=[];
    for(let u of user){
      console.log(u)

      const instructor= await instructorRepository.find({where:{user_id:u.id}});
      // console.log("instructor",
      //   instructor
      // )

      if(instructor)
        allInstructor.push({
          id: instructor[0].id,
          user:{...u,...instructor[0]}
        });
    }

    // const allInstructor = await instructorRepository.find({
    //   relations: ["skills"],
    // });
    

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
    // const instructorExist = await instructorRepository.findOne({
    //   ...filter,
    //   relations: ["skills", "reviews", "education"],
    // });

    const user= await dataSource.getRepository("User").findOne({...filter});
    const instructorExist= await dataSource.getRepository("Instructor")
    .findOne({where:{user_id:user.id},relations: ["skills", "reviews", "education"],})

    // const instructorExist = await dataSource
    //   .getRepository("User")
    //   .createQueryBuilder("user")
    //   .innerJoinAndSelect("Instructor", "instructor", "instructor.userId = user.id")
    //   .select([
    //     "user.id",
    //     "user.first_name",
    //     "instructor.experience AS experience",
    //     "instructor.specialization AS specialization",
    //   ])
    //   .getOne();
    if (instructorExist) {
      //console.log(instructorExist);
      return {
        ...user,
        ...instructorExist
      };
      //return instructorExist;
    }
    return null;
  } catch (error) {
    logger.error([
      "src > reposirtory > instructorRepository > findByFilter > error",
      error.message,
    ]);
    throw new Error(error);
  }
};

const updateInstructor = async (instructorId, videoUrl) => {
  const instructorExist = await instructorRepository.findOne({
    where: { id: instructorId },
  });

  if (!instructorExist) {
    return "No such instructor exists!";
  }

  Object.assign(instructorExist, { video_url: videoUrl });

  const updatedInstructor = await instructorRepository.save(instructorExist);
  console.log("updated instructor:", updatedInstructor);
  return "Instructor has been updated successfully";
};

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
  updateInstructor,
  // fetchAllInstructorWithSkills,
};
