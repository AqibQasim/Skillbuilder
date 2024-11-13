const fastify = require("fastify");
const { getPurchasedCoursesByUserIdController, getLockStatus } = require("../controllers/purchasedCoursesController");


const purchsedCoursesRoutes= async (fastify,options)=>{
    fastify.get('/get-purchased-courses/:user_id', getPurchasedCoursesByUserIdController)
}

module.exports= purchsedCoursesRoutes;