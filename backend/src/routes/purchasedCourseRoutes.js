const fastify = require("fastify");
const { getPurchasedCoursesByUserIdController, getLockStatus } = require("../controllers/purchasedCoursesController");
const { getPurchasedLiveCoursesController } = require("../controllers/purchasedLiveCourseController");


const purchsedCoursesRoutes= async (fastify,options)=>{
    fastify.get('/get-purchased-courses/:user_id', getPurchasedCoursesByUserIdController)
    //fastify.get('/get-all-students-of-purchased-courses')
    fastify.get('/get-purchased-live-courses', getPurchasedLiveCoursesController)
}

module.exports= purchsedCoursesRoutes;