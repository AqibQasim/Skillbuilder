const paymentService = require("../services/paymentService");

async function completeCheckout(req, reply) {
  try {
    const { session_id, order_id } = req.query;
    await paymentService.completeCheckoutSessionService(session_id, order_id);
    reply.send("Payment successful!");
  } catch (error) {
    console.error("Error completing checkout session:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function cancelCheckout(req, reply) {
  reply.send("Payment cancelled.");
}

async function completeCareerCounsellingPayment(req, reply) {
  try {
    const result = await paymentService.completeCareerCounsellingPayment(req);
    reply.status(200).send({ ...result });
  } catch (error) {
    console.error("Error completing checkout session:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function completeLiveSessionCoursePayment(req, reply) {
  try {
    const result = await paymentService.completeLiveSessionCoursePayment(req);
    reply.status(200).send({ ...result });
  } catch (error) {
    console.error("Error completing checkout session:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getCareerCounsellingPayment(req, reply) {
  try {
    const result = await paymentService.getCareerCounsellingPayment(req);
    reply.status(200).send({ ...result });
  } catch (error) {
    console.error("Error completing checkout session:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getCareerCounsellingPayments(req, reply) {
  try {
    const result = await paymentService.getCareerCounsellingPayments();
    reply.status(200).send({ ...result });
  } catch (error) {
    console.error("Error completing checkout session:", error);
    reply.status(500).send({ error: "Internal server error" });
  }
}

async function getLiveSessionCoursesOfStudent(req, reply) {
    try {
      const result = await paymentService.getLiveSessionCoursesOfStudent(req);
      reply.status(200).send({ ...result });
    } catch (error) {
      console.error("Error completing checkout session:", error);
      reply.status(500).send({ error: "Internal server error" });
    }
  }

  const setBookingOfCareerCounselling= async(req, reply)=>{
    try {
      const result = await paymentService.setBookingOfCareerCounselling(req);
      reply.status(200).send({ ...result });
    } catch (error) {
      console.error("Error completing checkout session:", error);
      reply.status(500).send({ error: "Internal server error" });
    }
  }

  const insertRecruitinnSummary=async(req,reply)=>{
    try {
      const result = await paymentService.insertRecruitinnSummary(req);
      reply.status(200).send({ ...result });
    } catch (error) {
      console.error("Error completing checkout session:", error);
      reply.status(500).send({ error: "Internal server error" });
    }
  }

module.exports = {
  setBookingOfCareerCounselling,
  completeCheckout,
  completeLiveSessionCoursePayment,
  cancelCheckout,
  completeCareerCounsellingPayment,
  getCareerCounsellingPayment,
  getLiveSessionCoursesOfStudent,
  insertRecruitinnSummary,
  getCareerCounsellingPayments
};
