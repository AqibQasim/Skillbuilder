const { logger } = require("../../logger");
const{newInstructor,readInstructors,readInstructor,readInstructorWithSkills}=require('../repositories/instructorRepository');
const{fetchSkills}=require('../repositories/skillsRepository');
// const {getskills}=require('../controllers/skillsController');

const getInstructorWithSkillss = async (instructorId) => {
    try {
      const instructor = await readInstructorWithSkills(instructorId);
      const skills = await fetchSkills(instructorId);
      console.log("Skills ",skills)
      return { instructor, skills };
    } catch (error) {
        // logger.info(error);
        console.log(error)
      throw new Error('Error fetching instructor with skills');
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