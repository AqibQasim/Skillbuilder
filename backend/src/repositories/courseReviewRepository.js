const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");

const getAllReviews = async (id) => {
  try {
    if(!id){
      const courseRevRep = await dataSource
      .getRepository("courseReviews")
      .createQueryBuilder("course_reviews")
      .leftJoin("course_reviews.course", "course")
      .leftJoin("course_reviews.user", "user")
      .where("course_reviews.course_id= course.id")
      .select([
        "course_reviews.id",
        "user.first_name",
        "user.last_name",
        "user.profile",
        "course_reviews.rating",
        "course_reviews.review",
        "course_reviews.date",
        "user.id",
      ])
      .getMany();
      return courseRevRep;
    }
    const courseRevRep = await dataSource
      .getRepository("courseReviews")
      .createQueryBuilder("course_reviews")
      .leftJoin("course_reviews.course", "course")
      .leftJoin("course_reviews.user", "user")
      .where("course_reviews.course_id= :course_id", { course_id: id })
      .select([
        "course_reviews.id",
        "user.first_name",
        "user.last_name",
        "user.profile",
        "course_reviews.rating",
        "course_reviews.review",
        "course_reviews.date",
        "user.id",
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
        ...data,
      });
      const saved = await courseRevRep.save(reviewCreating);
      console.log("Saved review:", saved);

      const courseReviews = await courseRevRep.find({ where: { course_id } });
      console.log("Course reviews found:", courseReviews);

      if (Array.isArray(courseReviews)) {
        let rating = 0;
        courseReviews.forEach((review) => {
          rating += parseFloat(review?.rating);
        });

        const avgRating = rating / courseReviews.length;
        console.log("Average rating is", avgRating);

        // Update the course rating
        const updateResult = await courseRep.update(
          { id: course_id },
          { rating: avgRating }
        );
        // await courseRep.save(updateResult);
        console.log("Update result:", updateResult);

        // Verify the format of the update result
        if (updateResult.affected > 0) {
          console.log("Course reviews updated successfully");
        } else {
          console.log("Failed to update course reviews");
        }
      } else {
        console.error("Failed to fetch course reviews or no reviews found");
      }

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
