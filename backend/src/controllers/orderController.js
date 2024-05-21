const orderService = require('../services/orderService');

async function initiateCheckout(req, reply) {
    try {
        const { userId, items } = req.body;
        const sessionId = await orderService.initiateCheckoutService(userId, items);
        reply.send({ sessionId });
    } catch (error) {
        console.error("Error initiating checkout:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}

module.exports = { initiateCheckout };
