const { getskills } = require("../controllers/skillsController");

const skillsRoutes = async (fastify, options) => {
  fastify.get('/skills', getskills);
  
};

module.exports = skillsRoutes;