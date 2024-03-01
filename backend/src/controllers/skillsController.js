const { logger } = require("../../logger");
const { getSkills } = require("../services/skillsServices");

const getskills = async (request, reply) => {
  try {
    const skills = await getSkills();
    reply.send(skills);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
    getskills,
};