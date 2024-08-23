const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const getAllReviews = async (id) => {
  try {
    const courseRevRep = await dataSource.getRepository("courseReviews")
    .createQueryBuilder("course_reviews")
    .leftJoin("course_reviews.course","course")
    .leftJoin("course_reviews.user","user")
    .where("course_reviews.course_id= :course_id",{course_id:id})
    .select([
      "course_reviews.id",
      "user.first_name",
      "user.last_name",
      "user.profile",
      "course_reviews.rating",
      "course_reviews.review",
      "course_reviews.date",
      "user.id"
    ])
    .getMany();
    // const allCourses = await courseRevRep.find({
    //   where: {
    //     course_id: id,
    //   },
    // });
    // console.log("Total courses:", allCourses);

    // return allCourses;
    return courseRevRep;
  } catch (err) {
    console.log("ERR:", err);
  }
};

const saveReview = async (data) => {
  const courseRevRep = dataSource.getRepository("courseReviews");
  const courseRep = dataSource.getRepository("course");
  const userRep = dataSource.getRepository("user");
  try {
    const { course_id, user_id } = data;
    if (course_id && user_id) {
      try {
        const course = await courseRep.findOne({ where: { id: course_id } });
        if (!course) {
          return "Course does not exist.";
        }

        const user = await userRep.findOne({ where: { id: user_id } });
        if (!user) {
          return "Register yourself first to review a course!";
        }
      } catch (err) {
        console.log("err:", err);
      }
      console.log("--------------------", data);
      const reviewCreating = courseRevRep.create({
        ...data
      });
      const saved = courseRevRep.save(reviewCreating);
      return "Review has been successfully posted.";
    }
  } catch (e) {
    console.log("ERR:", e);
  }
};

module.exports = {
  saveReview,
  getAllReviews,
};
