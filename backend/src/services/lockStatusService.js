const dataSource = require("../../Infrastructure/postgres");
const purchasedCourseRepo = dataSource.getRepository("purchased_course");

const getLockStatusService = async (user_id, course_id, is_admin) => {
  console.log(user_id, course_id, is_admin);
  try {

    if(is_admin=="true"){
      return { 
        status: 200, 
        lock_status: "unlocked", 
        lock: false 
      }
    }
    // Check purchase only if the user is not admin
    if (user_id!=null && is_admin == "false") {
      const is_purchased = await purchasedCourseRepo.findOne({
        where: {
          course_id,
          purchased_by: user_id,
        },
      });
      console.log(is_purchased)
      if (is_purchased != null) {
        return {
          status: 200,
          lock_status: "unlocked",
          lock: false,
        };
      }else{
        return { 
          status: 403, 
          lock_status: "locked", 
          lock: true 
        }
      }
    }

    return { 
      status: 403, 
      lock_status: "locked", 
      lock: true 
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
