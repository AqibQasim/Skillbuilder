const liveSessionCourseController= require('../controllers/liveSessionCourseController')

const liveSessionCourseRoutes = async (fastify, options) => {
    fastify.post('/create-live-session-course',liveSessionCourseController.createLiveSessionCourse)
}

module.exports= liveSessionCourseRoutes