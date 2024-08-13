const { logger } = require("../../logger");
const { findAll, create, purchaseCourseDetailsRepository } = require("../repositories/purchasedCourseRepository");
const { findUserById } = require("./userService");

const postPurchasedCourse = async (data) => {
  //   console.log("data in service: ", data);
  const { userId, courseId } = data;
  const isUserExist = await findUserById(userId);
  if (isUserExist) {
    for (const course_id of courseId) {
      const payload = {
        course_id,
        purchased_by: userId,
        created_at: new Date(),
      };
      await create(payload);
    }
    return "success";
  }
  else return 'user not exist'
};

const findAllPurchasedCourse = async (userId) => {
  try {
    const filter = {
      where: {
        purchased_by: userId,
      },
    };
    const data = await findAll(filter);
    return data;
  } catch (error) {
    logger.error("src > services > purchasedCourseService");
    logger.error(error.message);
    throw Error(error);
  }
};

const purchasedCourseDetailsById= async (userId)=>{

  try{
    const data= await purchaseCourseDetailsRepository(userId);
    return data;
  } catch (error) {
    logger.error("src > services > purchasedCourseService");
    logger.error(error.message);
    throw Error(error);
  }
  
}

module.exports = {
  postPurchasedCourse,
  findAllPurchasedCourse,
  purchasedCourseDetailsById,
};
