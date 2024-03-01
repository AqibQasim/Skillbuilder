const { getreviews } = require("../controllers/reviewController");

const reviewRoutes = async (fastify, options) => {
  fastify.get('/reviews', getreviews);
  
};

module.exports = reviewRoutes;