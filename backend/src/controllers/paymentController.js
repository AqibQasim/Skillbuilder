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

async function completeCareerCounsellingPayment(req,reply) {
    try {
        const result= await paymentService.completeCareerCounsellingPayment(req);
        reply.status(200).send({...result});
    } catch (error) {
        console.error("Error completing checkout session:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}

async function getCareerCounsellingPayment(req,reply) {
    try {
        const result= await paymentService.getCareerCounsellingPayment(req);
        reply.status(200).send({...result});
    } catch (error) {
        console.error("Error completing checkout session:", error);
        reply.status(500).send({ error: "Internal server error" });
    }
}

module.exports = { completeCheckout, cancelCheckout, completeCareerCounsellingPayment, getCareerCounsellingPayment };
