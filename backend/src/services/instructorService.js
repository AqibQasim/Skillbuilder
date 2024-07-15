const { fetchAllInstructor, instructorCreate, findByFilter } = require("../repositories/instructorRepository");
const {findAllCourses, findAllCoursesByInst } = require("../repositories/courseRepository");
const { logger } = require("../../logger");
const { findUserById } = require("./userService");
const { skillsInstuctorCreate } = require("./instructorSkillService");
const { educationInstuctorCreate } = require("./instructorEducationService");
const { uploadSingle } = require("../mediators/s3Mediator");

const createNewInstructor = async (instructorData) => {
  try {
    const { id, experience, specialization, qualifications, skills, video_url } = instructorData;
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

    console.log("upload video:", video_url);

    const isInstructorExist = await findByFilter({ where: { id: id } });
    if (isInstructorExist) {
      throw new Error("Instructor already Exist");
    }
    await instructorCreate({...instructorPayload, video_url});
    await skillsInstuctorCreate(skills, id);  
    await educationInstuctorCreate(qualifications, id);
  } catch (error) {
    console.log("message:",error)
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
    return InstructorReceive;
  } catch (error) {
    throw new Error(error);
  }
};

const getCoursesByInstService = async (id) => {
  try{
    const InstructorReceive = await findAllCoursesByInst(
      {
        where:{
          instructor_id : id
        }
      }
    );
    return InstructorReceive;
  }catch(e){
    throw new Error(error);
  }
}

module.exports = {
  getInstructors,
  createNewInstructor,
  getInstructorById,
  getCoursesByInstService
};
