
const paymentController = require('../controllers/paymentController');

async function paymentRoutes(fastify, options) {
    fastify.get('/complete', paymentController.completeCheckout);
    fastify.get('/cancel', paymentController.cancelCheckout);
}

module.exports = paymentRoutes;
