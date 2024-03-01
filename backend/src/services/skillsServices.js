const { fetchSkills } = require("../repositories/skillsRepository");

const getSkills = async () => {
  return await fetchSkills();
};

module.exports = {
    getSkills,
};