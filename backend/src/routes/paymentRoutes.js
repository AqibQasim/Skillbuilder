
const paymentController = require('../controllers/paymentController');

async function paymentRoutes(fastify, options) {
    fastify.get('/complete', paymentController.completeCheckout);
    fastify.get('/cancel', paymentController.cancelCheckout);
    fastify.post('/career-counselling-payment',paymentController.completeCareerCounsellingPayment);
    fastify.put('/set-booking', paymentController.setBookingOfCareerCounselling)
    fastify.get('/get-career-counselling-payment', paymentController.getCareerCounsellingPayment);
    fastify.get('/get-career-counselling-payments', paymentController.getCareerCounsellingPayments);
    fastify.post('/live-session-course-payment',paymentController.completeLiveSessionCoursePayment);
    fastify.get('/get-live-session-course-payment-of-student',paymentController.getLiveSessionCoursesOfStudent);
    fastify.post('/insert-recruitinn-summary',paymentController.insertRecruitinnSummary)
}

module.exports = paymentRoutes;
