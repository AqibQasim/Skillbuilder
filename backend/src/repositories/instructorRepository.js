const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");



const readInstructorWithSkills = async (id) => {
  try {
    const userRepository = dataSource.getRepository("Instructor");
    console.log("UserRepo",userRepository)
    // logger.info('instructooooooor');
    const instructor = await userRepository.find({where:{id:id}}, { relations: ["skills"] });
    console.log("Instructor",instructor);
    // logger.info('instructooooooor',instructor);
    return instructor;
  } catch (error) {
    throw new Error('Error reading instructor from database');
  }
};



const newInstructor = async (data) => {
  
  const userRepository = dataSource.getRepository("Instructor");
  const instructor = userRepository.create(data);
  await userRepository.save(instructor);
  return instructor;
};

const readInstructors = async () => {
    const userRepository = dataSource.getRepository("Instructor");
    const instructor = userRepository.find();
    return instructor;
  };

  const readInstructor = async (id) => {
    const userRepository = dataSource.getRepository("Instructor");
    logger.info(`id value at repo:  ${id}`);
    const instructor = userRepository.findOne({ where :{id: id} });
    return instructor;
  };

module.exports = {
  newInstructor,
  readInstructors,
  readInstructor,
  readInstructorWithSkills,
  
};