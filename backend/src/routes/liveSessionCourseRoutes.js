const liveSessionCourseController= require('../controllers/liveSessionCourseController')

const liveSessionCourseRoutes = async (fastify, options) => {
    fastify.post('/create-live-session-course',liveSessionCourseController.createLiveSessionCourse);
    fastify.get('/get-live-session-course',liveSessionCourseController.getLiveSessionCourse)
    fastify.get('/get-live-session-course/:course_id',liveSessionCourseController.getLiveSessionCourseById)
}

module.exports= liveSessionCourseRoutes