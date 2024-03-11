const { logger } = require("../../logger");
const {
  getpurchasedCourse,
  userPurchasedCourse,
} = require("../services/purchasedCourseService");

const getPurchasedCourse = async (request, reply) => {
  // const userId = request.params;
  try {
    const pcourse = await getpurchasedCourse();
    reply.send(pcourse);
  } catch (error) {
    reply.status(500).send(error);
  }
};

const userpurchasedCourse = async (request, reply) => {
  const userId = request.params.id;
  try {
    const pcourse = await userPurchasedCourse(userId);
    console.log("Users ....Controller...........", pcourse);
    reply.send(pcourse);
  } catch (error) {
    reply.status(500).send(error);
  }
};

module.exports = {
  getPurchasedCourse,
  userpurchasedCourse,
};
