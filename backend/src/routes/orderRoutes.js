const orderController = require('../controllers/orderController');

async function orderRoutes(fastify, options) {
    fastify.post('/checkout', orderController.initiateCheckout);
}

module.exports = orderRoutes;
