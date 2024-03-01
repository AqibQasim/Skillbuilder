const { logger } = require("../../logger");
const{newInstructor,readInstructors,readInstructor,readInstructorWithSkills}=require('../repositories/instructorRepository');
const { fetchReviews } = require("../repositories/reviewRepository");
const{fetchSkills}=require('../repositories/skillsRepository');
// const {getskills}=require('../controllers/skillsController');

const getInstructorWithSkillss = async (instructorId) => {
    try {
      const instructor = await readInstructorWithSkills(instructorId);
      const skills = await fetchSkills(instructorId);
      logger.info('skillllls value', skills);
      const reviews =await fetchReviews(instructorId);
    //   const reviews =['sample','data','for','review'];

      logger.info('review value', reviews);
      logger.info("Skills ", skills);
    //   logger.info("reviews ",reviews);
      return { instructor, skills, reviews };
    } catch (error) {
        // logger.info(error);
        console.log(error)
      throw new Error('Error fetching instructor with skills and review');
    }
  };

const createInstructor= async(data)=>{
    return await newInstructor(data);
};


const ReadInstructor= async(id)=>{
    logger.info(`id value at services ${id}`);
    return await readInstructor(id);
};

const ReadInstructors= async()=>{
    return await readInstructors();
};

module.exports={createInstructor,ReadInstructors,ReadInstructor,getInstructorWithSkillss}