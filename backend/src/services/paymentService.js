const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const orderRepository = require('../repositories/orderRepository');
const paymentRepository = require('../repositories/paymentRepository');



async function completeCheckoutSessionService(session_id, order_id) {
    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === 'paid') {
            const order = await orderRepository.findOne({ where: { id: order_id } });
            if (!order) {
                throw new Error('Order not found');
            }

            order.status = 'paid';
            await orderRepository.save(order);

            // Create and save the payment information
            const payment = paymentRepository.paymentRepository.create({
                order_id: order.id,
                payment_intent: session.payment_intent,
                amount: session.amount_total / 100,
                currency: session.currency,
                status: session.payment_status,
            });
            await paymentRepository.paymentRepository.save(payment);
        }
    } catch (error) {
        console.error("Error completing checkout session:", error);
        throw new Error("Internal server error");
    }
}

module.exports = { completeCheckoutSessionService };
