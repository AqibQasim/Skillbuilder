
const paymentController = require('../controllers/paymentController');

async function paymentRoutes(fastify, options) {
    fastify.get('/complete', paymentController.completeCheckout);
    fastify.get('/cancel', paymentController.cancelCheckout);
    fastify.post('/career-counselling-payment',paymentController.completeCareerCounsellingPayment);
    fastify.get('/get-career-counselling-payment', paymentController.getCareerCounsellingPayment);
    fastify.post('/live-session-course-payment',paymentController.completeLiveSessionCoursePayment);

}

module.exports = paymentRoutes;
