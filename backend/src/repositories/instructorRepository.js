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
    const user = await dataSource.getRepository("User").find();
    //console.log(user)

    const allInstructor = [];
    for (let u of user) {
      console.log(u);

      const instructor = await instructorRepository.find({
        where: { user_id: u.id },
      });
      //console.log("////////////////////////////",instructor)
      // console.log("instructor",
      //   instructor
      // )

      if (instructor.length > 0)
        allInstructor.push({
          id: instructor[0].id,
          user: { ...u, ...instructor[0] },
        });
    }

    // const allInstructor = await instructorRepository.find({
    //   relations: ["skills"],
    // });

    if (allInstructor.length == 0) {
      return null;
    }
    return allInstructor;

    // const instructorExist = await dataSource
    //   .getRepository("Instructor")
    //   .createQueryBuilder("instructor")
    //   .innerJoin("instructor.user","user")
    //   //.where("user.id=instructor.user_id")
    //   .select([
    //     "user.id",
    //     "user.first_name",
    //     "user.profile",
    //     "user.email",
    //     "user.profession",
    //     "user.facebook_profile",
    //     "user.is_active",
    //     "user.role",
    //     "user.source",
    //     "user.created_at",
    //     "user.updated_at",
    //     "user.status",
    //     "user.status_desc",
    //     "instructor.experience",
    //     "instructor.specialization",
    //     "instructor.video_url"
    //   ])
    //   .getMany();

    // if (instructorExist) {
    //   return null;
    // }
    // return instructorExist;
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

    // const user= await dataSource.getRepository("User").findOne({...filter});
    // const instructorExist= await dataSource.getRepository("Instructor")
    // .findOne({where:{user_id:user.id},relations: ["skills", "reviews", "education"],})
    console.log("inst id in:", filter);
    const inst_id = filter?.id;
    const instructorExist = await dataSource
      .getRepository("Instructor")
      .createQueryBuilder("instructor")
      .innerJoinAndSelect("instructor.user", "user")
      .innerJoinAndSelect("instructor.skills", "skills")
      .select([
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.profile",
        "user.email",
        "user.profession",
        "user.facebook_profile",
        "user.is_active",
        "user.role",
        "user.source",
        "user.created_at",
        "user.updated_at",
        "instructor.status",
        "instructor.user_id",
        "user.status_desc",
        "instructor.experience",
        "instructor.specialization",
        "instructor.video_url",
        "skills",
        // "instructor.skills"
      ])
      .where("instructor.id = :inst_id", { inst_id })
      .getOne();
    if (instructorExist) {
      //console.log(instructorExist);
      return {
        //...user,
        ...instructorExist,
        // ...instructorExist['user']
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

// const { getRepository } = require("typeorm");

async function findByFilterTwo(userId) {
  // const id = userId.id;
  const instructor = await dataSource.getRepository("User")
    .createQueryBuilder("user")
    // .leftJoinAndSelect("instructor.skills", "skills")
    // .leftJoinAndSelect("instructor.education", "education")
    // .leftJoinAndSelect("instructor.reviews", "reviews")
    // .leftJoinAndSelect("instructor.user", "user")
    .where("user.id = :userId", {  userId: userId.id }) // Filter by user's id
    .getOne();

  return instructor;
}


// const findByFilterTwo = async (filter) => {
//   try {
//     // const instructorExist = await instructorRepository.findOne({
//     //   ...filter,
//     //   relations: ["skills", "reviews", "education"],
//     // });

//     // const user= await dataSource.getRepository("User").findOne({...filter});
//     // const instructorExist= await dataSource.getRepository("Instructor")
//     // .findOne({where:{user_id:user.id},relations: ["skills", "reviews", "education"],})
//     console.log("inst id in:", filter);
//     const inst_id = filter?.id;
//     const instructorExist = await dataSource
//       .getRepository("User")
//       .createQueryBuilder("user")
//       .innerJoinAndSelect("user.instructor", "instructor")  
//       // .innerJoinAndSelect("user.skills", "skills")
//       .select([
//         "user.id",
//         "user.first_name",
//         "user.last_name",
//         "user.profile",
//         "user.email",
//         "user.profession",
//         "user.facebook_profile",
//         "user.is_active",
//         "user.role",
//         "user.source",
//         "user.created_at",
//         "user.updated_at",
//         "instructor.status",
//         "instructor.user_id",
//         "user.status_desc",
//         "instructor.experience",
//         "instructor.specialization",
//         "instructor.video_url",
//         // "instructor.skills",
//         // "instructor.skills"
//       ])
//       .where("user.id = :inst_id", { inst_id })
//       .getOne();
//     if (instructorExist) {
//       //console.log(instructorExist);
//       return {
//         //...user,
//         ...instructorExist,
//         // ...instructorExist['user']
//       };
//       //return instructorExist;
//     }
//     return null;
//   } catch (error) {
//     logger.error([
//       "src > reposirtory > instructorRepository > findByFilter > error",
//       error.message,
//     ]);
//     throw new Error(error);
//   }
// };

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
  findByFilterTwo
  // fetchAllInstructorWithSkills,
};
