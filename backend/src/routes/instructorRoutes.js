const {
  getAllInstructor,
  instructorDetail,
  createInstructor,
  getCoursesByInstructor,
  uploadInstVideo,
  stripeAccRegister,
  checkPaymentRecord
} = require("../controllers/InstructorController");

const {createInstructorSchema, getAllInstructorsSchema, instructorDetailSchema} = require("../Schema/instructorSchema")

const instructorRoutes = async (fastify, options) => {

  fastify.post("/create-instructor",createInstructorSchema, createInstructor);
  
  fastify.get("/get-all-instructors",getAllInstructorsSchema, getAllInstructor);

  fastify.get("/instructor-detail/:id",instructorDetailSchema, instructorDetail);

  fastify.get('/get-courses-inst/:id',getCoursesByInstructor)

  fastify.post("/upload", uploadInstVideo);

  fastify.post("/inst-stipe-acc-reg", stripeAccRegister);

  fastify.get("/check-payment-rec", checkPaymentRecord);
};

module.exports = instructorRoutes;
