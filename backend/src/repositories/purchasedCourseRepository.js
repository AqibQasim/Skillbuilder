const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const { userRepo } = require("../entities/userEntity");

const fetchPurchasedCourses = async () => {
  try {
    const purchasedCourseRepository =
      dataSource.getRepository("PurchasedCourse");

    const purchasedCourses = await purchasedCourseRepository
      .createQueryBuilder("purchasedCourse")
      .leftJoinAndSelect("purchasedCourse.user", "user")
      .leftJoinAndSelect("purchasedCourse.course", "course")
      .select([
        "purchasedCourse.id AS purchasedCourse_id",
        "purchasedCourse.purchase_date AS purchasedCourse_purchase_date",
        "purchasedCourse.amount_paid AS purchasedCourse_amount_paid",
      ])
      .addSelect([
        "user.id AS user_id",
        "user.name AS user_name",
        "user.email AS user_email",
        "course.id AS course_id",
        "course.title AS course_title",
        "course.description AS course_description",
      ])
      .getRawMany();

    logger.info("Purchased Courses: ", purchasedCourses);
    return purchasedCourses;
  } catch (error) {
    throw new Error("Error fetching Purchased Courses");
  }
};

const fetchuserPurchasedCourses = async (userId) => {
  try {
    const userRepository = dataSource.getRepository("User");
    const user = await userRepository.findOneBy({
      id: userId,
    });
    if (user) {
      const purchasedCourseRepository =
        dataSource.getRepository("PurchasedCourse");
      const userpurchasedCourses = await purchasedCourseRepository
        .createQueryBuilder("purchasedCourse")
        .leftJoinAndSelect("purchasedCourse.user", "user")
        .leftJoinAndSelect("purchasedCourse.course", "course")
        .select([
          "purchasedCourse.id AS purchasedCourse_id",
          "purchasedCourse.purchase_date AS purchasedCourse_purchase_date",
          "purchasedCourse.amount_paid AS purchasedCourse_amount_paid",
          "course.course_length AS course_length",
          "purchasedCourse.watched_length AS watched_length",
          "user.id AS user_id",
          "user.name AS user_name",
          "user.email AS user_email",
          "course.id AS course_id",
          "course.title AS course_title",
          "course.description AS course_description",
        ])
        .where("user.id = :userId", { userId })
        .getRawMany();

      logger.info(userpurchasedCourses);
      return userpurchasedCourses;
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Error fetching user purchased courses: " + error.message);
  }
};

// const fetchuserPurchasedCourses = async (userId) => {
//   try {
//     console.log(userId);
//     const purchasedCourseRepository =
//       dataSource.getRepository("purchased_course");
//     console.log("purchcased course", purchasedCourseRepository);
//     const userID = await purchasedCourseRepository.findOne({
//       where: { id: userId },
//     });
//     console.log("usereeeeeer id", userID);
//     const { user_id } = userID;
//     console.log(user_id);
//     if (userID) {
//       const userpurchasedCourses = await purchasedCourseRepository
//         .createQueryBuilder("purchasedCourse")
//         .leftJoinAndSelect("purchasedCourse.user", "user")
//         .leftJoinAndSelect("purchasedCourse.course", "course")
//         .select([
//           "purchasedCourse.id AS purchasedCourse_id",
//           "purchasedCourse.purchase_date AS purchasedCourse_purchase_date",
//           "purchasedCourse.amount_paid AS purchasedCourse_amount_paid",
//         ])
//         .addSelect([
//           "user.id AS user_id",
//           "user.name AS user_name",
//           "user.email AS user_email",
//           "course.id AS course_id",
//           "course.title AS course_title",
//           "course.description AS course_description",
//         ])
//         .where("user.id = :userId", { user_id })
//         .getRawMany();
//       logger.info(userpurchasedCourses);
//       return userpurchasedCourses;
//     }
//   } catch (error) {
//     throw new Error("Error fetching user purchased courses");
//   }
// };

// const fetchuserPurchasedCourses = async (userId) => {
//   try {
//     const { user_id } = userId;
//     console.log(user_id);
//     const purchasedCourseRepository =
//       dataSource.getRepository("PurchasedCourse");

//     const userpurchasedCourses = await purchasedCourseRepository.findOne({
//       where: { user_id: userId },
//       relations: ["user", "course"],
//       select: [
//         "id AS purchasedCourse_id",
//         "purchase_date AS purchasedCourse_purchase_date",
//         "amount_paid AS purchasedCourse_amount_paid",
//         "user.id AS user_id",
//         "user.name AS user_name",
//         "user.email AS user_email",
//         "course.id AS course_id",
//         "course.title AS course_title",
//         "course.description AS course_description",
//       ],
//     });

//     logger.info(userpurchasedCourses);
//     return userpurchasedCourses;
//   } catch (error) {
//     throw new Error("Error fetching user purchased courses");
//   }
// };

module.exports = {
  fetchuserPurchasedCourses,
  fetchPurchasedCourses,
};
