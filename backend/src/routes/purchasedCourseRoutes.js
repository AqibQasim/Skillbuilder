const fastify = require("fastify");
const { getPurchasedCoursesByUserIdController } = require("../controllers/purchasedCoursesController");


const purchsedCoursesRoutes= async (fastify,options)=>{
    fastify.get('/get-purchased-courses/:user_id', getPurchasedCoursesByUserIdController)
}

module.exports= purchsedCoursesRoutes;