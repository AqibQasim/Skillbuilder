const {
  getAllInstructor,
  instructorDetail,
  createInstructor,
  getCoursesByInstructor,
  uploadInstVideo
} = require("../controllers/InstructorController");

const {createInstructorSchema, getAllInstructorsSchema, instructorDetailSchema} = require("../Schema/instructorSchema")

const instructorRoutes = async (fastify, options) => {

  fastify.post("/create-instructor",createInstructorSchema, createInstructor);
  
  fastify.get("/get-all-instructors",getAllInstructorsSchema, getAllInstructor);

  fastify.get("/instructor-detail/:id",instructorDetailSchema, instructorDetail);

  fastify.get('/get-courses-inst/:id',getCoursesByInstructor)

  fastify.post("/upload", uploadInstVideo);
};

module.exports = instructorRoutes;
