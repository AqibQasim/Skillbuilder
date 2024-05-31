const paymentService = require('../services/paymentService');


async function completeCheckout(req, reply) {
    try {
        const { session_id, order_id } = req.query;
        await paymentService.completeCheckoutSessionService(session_id, order_id);
        reply.send('Payment successful!');
    } catch (error) {
        console.error("Error completing checkout session:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}

async function cancelCheckout(req, reply) {
    reply.send('Payment cancelled.');
}

module.exports = { completeCheckout, cancelCheckout };
