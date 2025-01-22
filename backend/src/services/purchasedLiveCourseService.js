const dataSource = require("../../Infrastructure/postgres");


const purchaseLiveCourseDetailsService = async () => {
    const purchasedCourses = await dataSource
      .getRepository("live-session-payments")
      .createQueryBuilder("live_session_payments")
      .leftJoinAndSelect("live_session_payments.student","student")
      .leftJoinAndSelect("live_session_payments.course", "course")
      .leftJoinAndSelect("course.instructor", "instructor") // Join with instructor table
      .leftJoinAndSelect("instructor.user", "instructor_user") // Join with user table for instructor details
      .select([
        "live_session_payments.id",
        "live_session_payments.created_at",
        //"user.id",
        "course.id",
        "course.amount",
        "course.discount",
        "course.description",
        //"course.created_at",
        "course.image",
        "course.title",
        "course.instructor_id",
        "instructor.id", // Instructor's id
        "instructor_user.first_name", // Instructor's first name
        "instructor_user.last_name", // Instructor's last name
        "student.first_name",
        "student.last_name",
        "student.email",
      ])
      //.where("purchased_course.purchased_by = :user_id", { user_id: user_id })
      .getMany();
  
    if (purchasedCourses.length > 0) {
      return {
        status: 200,
        message: "purchased live courses found",
        data: purchasedCourses
      };
    }
    return {
        status: 404,
        message: "purchased live courses not found",
      };;
  };

  module.exports= purchaseLiveCourseDetailsService;