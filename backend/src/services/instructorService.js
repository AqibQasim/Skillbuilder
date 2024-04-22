const { fetchAllInstructor, instructorCreate, findByFilter } = require("../repositories/instructorRepository");
const { logger } = require("../../logger");
const { findUserById } = require("./userService");
const { skillsInstuctorCreate } = require("./instructorSkillService");
const { educationInstuctorCreate } = require("./instructorEducationService");
const { uploadOnS3 } = require("../mediators/instructorMediator");

const createNewInstructor = async (instructorData) => {
  try {
    const { id, experience, specialization, qualifications, skills, video } = instructorData;
    const user = await findUserById(id);
    if (!user) {
      throw new Error("user not exist");
    }
    const instructorPayload = {
      id,
      experience,
      specialization,
      created_at: new Date(),
    };
    const video_url = await uploadOnS3(video);
    console.log("upload video", video_url);

    const isInstructorExist = await findByFilter({ where: { id: id } });
    if (isInstructorExist) {
      throw new Error("Instructor already Exist");
    }
    await instructorCreate({...instructorPayload, video_url});
    const skillsJson = JSON.parse(skills);
    const qualificationJson = JSON.parse(qualifications);
    await skillsInstuctorCreate(skillsJson, id);
    await educationInstuctorCreate(qualificationJson, id);

    // console.log("update user in instructor service > ", updateUser);
  } catch (error) {
    logger.error(["src > services > instructorService", error.message]);
    throw Error(error);
  }
};

const getInstructors = async () => {
  try {
    logger.info("src > instructorServices > getAllInstructor");
    const InstructorReceive = await fetchAllInstructor();
    return InstructorReceive;
  } catch (error) {
    throw error;
  }
};

const getInstructorById = async (id) => {
  try {
    logger.info("src > instructorServices > getInstructorById");
    const InstructorReceive = await findByFilter({where: {id: id}});
    console.log("Service Instructor", InstructorReceive);
    return InstructorReceive;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getInstructors,
  createNewInstructor,
  getInstructorById,
};
