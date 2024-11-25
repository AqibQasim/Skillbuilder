const dataSource = require("../../Infrastructure/postgres");
const purchasedCourseRepo = dataSource.getRepository("purchased_course");

const getLockStatusService = async (user_id, course_id) => {
  try {
    const isPurchased = await purchasedCourseRepo.findOne({
      where: {
        course_id,
        purchased_by: user_id,
      },
    });
    if (!isPurchased) {
      return { status: 403, lock_status: "locked", lock: true };
    }
    return {
      status: 200,
      lock_status: "unlocked",
      lock: false,
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message,
    };
  }
};
module.exports = {
  getLockStatusService,
};