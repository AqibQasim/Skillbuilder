const { logger } = require("../../logger");
const { getReviews } = require("../services/reviewService");

const getreviews = async (request, reply) => {
  try {
    const review = await getReviews();
    reply.send(review);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
    getreviews,
};