const { fetchInstructorWithSkills,postInstructor,getInstructors,getInstructor } = require("../controllers/instructorController");
// const { getInstructorWithSkills } = require("../repositories/instructorRepository");

const instructorRoutes = async (fastify, options) => {
//   fastify.post('/user', postInstructor);
  fastify.get('/user', getInstructors);
  fastify.get('/users/:id', fetchInstructorWithSkills);
  
};

module.exports = instructorRoutes;