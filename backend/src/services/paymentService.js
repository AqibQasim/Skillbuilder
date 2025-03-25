const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const dataSource = require("../../Infrastructure/postgres");
const orderRepository = require("../repositories/orderRepository");
const paymentRepository = require("../repositories/paymentRepository");
const careerCounsellingPaymentRepository = dataSource.getRepository(
  "CareerCounsellingPayments"
);
const liveSessionPaymentRepository = dataSource.getRepository(
  "live-session-payments"
);

async function completeCheckoutSessionService(session_id, order_id) {
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      const order = await orderRepository.findOne({ where: { id: order_id } });
      if (!order) {
        throw new Error("Order not found");
      }

      order.status = "paid";
      await orderRepository.save(order);

      // Create and save the payment information
      const payment = paymentRepository.paymentRepository.create({
        order_id: order.id,
        payment_intent: session.payment_intent,
        amount: session.amount_total / 100,
        currency: session.currency,
        status: session.payment_status,
      });
      await paymentRepository.paymentRepository.save(payment);
    }
  } catch (error) {
    console.error("Error completing checkout session:", error);
    throw new Error("Internal server error");
  }
}

const completeCareerCounsellingPayment = async (req) => {
  const { student_id, instructor_id, booking_date, booking_time } = req.body;
  const createdCareerCounsellingObject =
    careerCounsellingPaymentRepository?.create({
      student_id,
      instructor_id,
      booking_date,
      booking_time,
    });
  await careerCounsellingPaymentRepository?.save(
    createdCareerCounsellingObject
  );
  return {
    status: 200,
    message: "Payment done successfully",
  };
};

const completeLiveSessionCoursePayment = async (req) => {
  const { student_id, instructor_id, amount, course_id } = req.body;

  const hasStudentAlreadyPaid = await liveSessionPaymentRepository?.findOne({
    where: {
      student_id,
      course_id,
    },
  });

  if (hasStudentAlreadyPaid) {
    return {
      status: 400,
      message: "You already have paid for this course",
    };
  }
  const liveSessionCoursePaymentObject = liveSessionPaymentRepository?.create({
    student_id,
    instructor_id,
    amount,
    course_id,
  });
  await liveSessionPaymentRepository?.save(liveSessionCoursePaymentObject);
  return {
    status: 200,
    message: "Payment done successfully",
  };
};

const getCareerCounsellingPayment = async (req) => {
  const { student_id } = req?.query;
  const studentCareerCounsellingPayment =
    // await careerCounsellingPaymentRepository?.createQueryBuilder()({
    //   where: {
    //     student_id,
    //   },
    // });
    await careerCounsellingPaymentRepository
      ?.createQueryBuilder("career_counselling_payments")
      .leftJoinAndSelect("career_counselling_payments.student", "student")
      .leftJoinAndSelect("career_counselling_payments.instructor", "instructor")
      .leftJoinAndSelect("instructor.user", "user")
      .select([
        "career_counselling_payments.amount",
        "career_counselling_payments.booking_date",
        "career_counselling_payments.booking_time",
        "career_counselling_payments.recruitinn_summary",
        "career_counselling_payments.created_at",
        "student.first_name",
        "student.last_name",
        "student.email"
      ])
      .where("career_counselling_payments.student_id= :student_id",{student_id})
      .getOne();

  if (!studentCareerCounsellingPayment) {
    return {
      status: 404,
      message: "Payment of student not found",
    };
  }
  return {
    status: 200,
    message: "Payment found",
    data: studentCareerCounsellingPayment,
  };
};

const getCareerCounsellingPayments = async () => {
  const studentCareerCounsellingPayment =
    await careerCounsellingPaymentRepository
      ?.createQueryBuilder("career_counselling_payments")
      .leftJoinAndSelect("career_counselling_payments.student", "student")
      .leftJoinAndSelect("career_counselling_payments.instructor", "instructor")
      .leftJoinAndSelect("instructor.user", "user")
      .select([
        "career_counselling_payments.amount",
        "career_counselling_payments.booking_date",
        "career_counselling_payments.booking_time",
        "career_counselling_payments.recruitinn_summary",
        "career_counselling_payments.created_at",
        "student.first_name",
        "student.last_name",
        "student.email",
        "student.id"
      ])
      .getMany();

  if (!studentCareerCounsellingPayment) {
    return {
      status: 404,
      message: "Payment of students not found",
    };
  }
  return {
    status: 200,
    message: "Payments found",
    data: studentCareerCounsellingPayment,
  };
};

const getLiveSessionCoursesOfStudent = async (req) => {
  const { student_id, course_id } = req?.query;
  const course= await liveSessionPaymentRepository.createQueryBuilder("live-session-course-payment")
  .leftJoinAndSelect("live-session-course-payment.course","course")
  .where("course.id= :id",{id:course_id})
  .select()
  .getOne();
  // const courses = await liveSessionPaymentRepository?.findOne({
  //   where: {
  //     student_id,
  //     course_id,
  //   },
  // });

  if (course) {
    return {
      status: 200,
      message: "live courses",
      data: course,
    };
  }

  return {
    status: 404,
    message: "Student has not paid for that course",
  };
};

const setBookingOfCareerCounselling = async (req) => {
  const { booking_date, booking_time, student_id, instructor_id } = req.body;
  const checkIfStudentHasPaidForCareerCounselling =
    await careerCounsellingPaymentRepository?.find({
      where: {
        student_id,
        instructor_id,
      },
    });

  if (!checkIfStudentHasPaidForCareerCounselling) {
    return {
      status: 404,
      message: "Student has not paid for career counselling",
    };
  }
  //update
  const updateResult = await careerCounsellingPaymentRepository?.update(
    { student_id, instructor_id },
    { booking_date, booking_time }
  );

  if (updateResult?.affected > 0) {
    return {
      status: 200,
      message: "Updated",
      data: checkIfStudentHasPaidForCareerCounselling,
    };
  }
};

const insertRecruitinnSummary = async (req) => {
  const { student_id, instructor_id, recruitinn_summary } = req.body;

  try {
    //find the row
    const checkIfStudentHasPaidForCareerCounselling =
      await careerCounsellingPaymentRepository?.find({
        where: {
          student_id,
          instructor_id,
        },
      });

    if (!checkIfStudentHasPaidForCareerCounselling) {
      return {
        status: 404,
        message: "Student has not paid for career counselling",
      };
    }
    //update
    const updateResult = await careerCounsellingPaymentRepository?.update(
      {
        student_id: parseInt(student_id),
        instructor_id: parseInt(instructor_id),
      },
      { recruitinn_summary }
    );

    if (updateResult?.affected > 0) {
      return {
        status: 200,
        message: "Updated",
        data: checkIfStudentHasPaidForCareerCounselling,
      };
    }

    return {
      status: 400,
      message: "something went wrong while inserting recruitinn summary",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};

module.exports = {
  completeCheckoutSessionService,
  completeCareerCounsellingPayment,
  getCareerCounsellingPayment,
  completeLiveSessionCoursePayment,
  getLiveSessionCoursesOfStudent,
  setBookingOfCareerCounselling,
  insertRecruitinnSummary,
  getCareerCounsellingPayments,
};
