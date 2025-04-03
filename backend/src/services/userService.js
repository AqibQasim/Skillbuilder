const {
  createUser,
  readAllUser,
  findUser,
  UserContact,
  updateUserByEmail,
  updateUserById,
  findOneUser,
  setUserStatusRepository,
} = require("../repositories/userRepository");
const dataSource = require("../../Infrastructure/postgres");
const courseRepository = dataSource.getRepository("Course");
const {
  findAllCoursesByInst,
  findAllCourses,
  studentEnrolledCoursesOnInstructorRepository,
} = require("../repositories/courseRepository");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { logger } = require("../../logger");
const { redisClient } = require("../../Infrastructure/redis");
const {
  sendVerificationEmail,
  verifyPassword,
  sendOTPMail,
} = require("../mediators/userMediator");
const { findOneCourse } = require("../repositories/courseRepository");
const { EntityRepository } = require("typeorm");
const { forEach } = require("lodash");
const { checkIfUserIsStudent } = require("../utils/checkIfUserIsStudent");
const {
  findOneByFilter,
} = require("../repositories/purchasedCourseRepository");
const { postPurchasedCourse } = require("./purchasedCourseService");
const {
  findInstructorById,
  findInstructorByInstructorId,
} = require("../repositories/instructorRepository");
const { createPayment } = require("../repositories/paymentRepository");
const {
  createOrderService,
  createOrder,
  createOrderItem,
} = require("./orderService");
const {
  createNotificationInstructor,
  createNotificationStudent,
} = require("./notificationService");
const webPush = require("../../notification_config/notificationConfig");

const emailVerificationForRegister = async (userInfo) => {
  try {
    console.log("user info:", userInfo);
    const { email } = userInfo;
    const existingUser = await findUser({ email });
    if (existingUser) {
      return {
        code: 400,
        message: "User Already Exists With This Email",
      };
    }

    const verificationToken = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    logger.info([
      "src > repository > userRepository > verificationToken",
      verificationToken,
    ]);
    await redisClient.set(email, verificationToken);
    const resultFromEmail = await sendVerificationEmail(
      email,
      verificationToken
    );
    return {
      code: 200,
      message: resultFromEmail,
    };
  } catch (err) {
    console.log("error:", err);
    return {
      code: 400,
      message: err,
    };
  }
};

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com", // Replace with your Hostinger SMTP server
  port: 465, // Use 587 for TLS or 465 for SSL
  secure: true, // true for SSL
  auth: {
      user: process.env.MAIL_USER, // Your Hostinger email
      pass: process.env.MAIL_PASS, // Your email password
  },
});

const sendEmailService = async (email, content, subject) => {
  try {
    const checkIfUserIsInDb = await findUser({
      email: email,
    });

    console.log("User found:", checkIfUserIsInDb);

    if (checkIfUserIsInDb) {
      const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: subject,
        html: ` <p>
        ${content}
        </p>`,
      };

      await transporter.sendMail(mailOptions);

      logger.info("Email sent successfully.");
      return {
        userId: checkIfUserIsInDb?.id,
        message:
          "An email has been sent to the entered email. Please verify if this is your account.",
      };
    } else {
      return {
        message: "User with this email doesn't exist.",
      };
    }
  } catch (error) {
    logger.error("Error sending verification email:", error);
    return "Unsuccessful to send a verification mail.";
  }
};

const enrollInCourseService = async ({
  student_id,
  courses,
  filter,
  subscription,
}) => {
  //let isCourseNotFound= false;
  //console.log(courses);
  
  
  console.log("Subscription received:", subscription);
  let mess = null;
  let totalAmount = 0;

  for (let course of courses) {
    totalAmount += course.price;
    //console.log("///////////////////////////////",filter,course.course_id);
    const c = await findOneCourse(filter, course.course_id);
    if (!c) {
      mess = {
        status: 404,
        message:
          "The requested course either doesn't exist or has been removed",
      };
      break;
    } else {
      try {
        const isUserAlreadyPurchasedCourse = await findOneByFilter({
          where: {
            purchased_by: student_id,
            course_id: course.course_id,
          },
        });

        const createInstructorNotification = await createNotificationInstructor({
          notification_title: "Congrats!!",
          notification_message: `One student has purchased a course ${c.title}`,
          instructor_id: c.instructor.id,
        });

        const createStudentNotification = await createNotificationStudent({
          notification_title: "Congrats!!",
          notification_message: "You have purchased course successfully",
          student_id: c.instructor.id,
        });


        if (isUserAlreadyPurchasedCourse) {
          mess = {
            status: 400,
            message: "course already purchased",
          };
          break;
        } else {
          const result = await postPurchasedCourse({
            userId: student_id,
            courseId: course.course_id,
          });

          if (result === "success") {
            let enrolledCustomers =
              c.enrolled_customers?.length > 0 ? c.enrolled_customers : [];
            enrolledCustomers.push({ student_id: student_id });
            console.log("enrolled customers:", enrolledCustomers);

            //update enrolled customers
            c.enrolled_customers = enrolledCustomers;
            await courseRepository.save(c);
          }
        }

        const notificationPayload = {
          title: "Congrats!!",
          body: "You have purchased course successfully",
        };

        webPush
          .sendNotification(subscription, JSON.stringify(notificationPayload))
          .then((res) => {
            console.log("notification sent successfullyyy");
          });
      } catch (err) {
        console.log("ERROR while enrolling:", err);
        return "ERROR while enrolling:", err;
      }
    }
  }

  if (!mess) {
    const order_result = await createOrder(student_id, totalAmount);

    //console.log(courses)

    for (let course of courses) {
      console.log("\\\\\\\\\\\\\\\\\\a", course);
      //update orders and order items table
      const order_item_result = await createOrderItem(order_result.id, course);
      if (order_item_result.length == 0) {
        mess = {
          status: 500,
          message: "order item result not inserted",
        };
        break;
      }
    }
  }

  if (!mess) {
    return {
      status: 200,
      message: "enrolled course successfully",
    };
  }

  return mess;
  //const confirmOrder = await createOrderService(student_id, courses);
};

const createUserAfterVerification = async (verificationToken) => {
  try {
    const tokenData = jwt.decode(verificationToken, process.env.JWT_SECRET);
    console.log("userdata: ", tokenData);
    const isUserExist = await findUser({ email: tokenData?.email });
    if (isUserExist) {
      logger.info(["user already exists", isUserExist]);
      throw new Error("User already exists with this email");
    }
    const hashedPassword = await bcrypt.hash(tokenData?.password, 10);
    const currentTime = new Date();
    console.log("currentTime: ", currentTime);
    const userData = {
      ...tokenData,
      password: hashedPassword,
      created_at: currentTime,
    };
    let newUser = await createUser(userData);
    console.log("id:", newUser?.id);
    let token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET);
    return {
      token: token,
      userId: newUser?.id,
    };
  } catch (err) {
    console.log("error:", err);
    throw err;
  }
};

const googleAuthService= async(body)=>{
  const isUserExist = await findUser({ email: body?.email });
    if (isUserExist) {
      logger.info(["user already exists", isUserExist]);
      return{
        status: 200,
        message: "user already exist",
        data: isUserExist
      }
    }
    
    //console.log("currentTime: ", currentTime);
    const currentTime = new Date();
    const userData = {
      ...body,
      password: null,
      created_at: currentTime,
    };
    let newUser = await createUser(userData);
    return {
      status: 200,
      message: "user registered successfully",
      data: newUser
    }
}

const findAllUser = async () => {
  try {
    const data = await readAllUser();
    return data;
  } catch (error) {
    logger.error(error.message);
    throw Error(error);
  }
};

const UserLogin = async (loginData) => {
  try {
    const { email, password } = loginData;
    const isUserExist = await findUser({ email: email });

    logger.info([
      "src > services > userService > UserLogin ? existingUser: ",
      isUserExist,
    ]);
    if (!isUserExist) {
      throw Error("User does not exist");
    }

    const passwordVerification = await verifyPassword(password, isUserExist);
    console.log("password verification: ", passwordVerification);

    return passwordVerification;
  } catch (error) {
    logger.error(error.message);
    throw Error(error);
  }
};

const getOneUserService = async (id) => {
  try {
    if (id === null) {
      return {
        status: 400,
        message: "user id can not be null",
      };
    }
    let user = await findOneUser(id);
    if (user) {
      console.log("User:", user);
      return {
        status: 200,
        message: user,
      };
    } else {
      return {
        status: 404,
        message: "User not found",
      };
    }
  } catch (e) {
    console.log("ERR:", e);
    return {
      status: 400,
      message: e.message,
    };
  }
};

const createGoogleUser = async (userInfo) => {
  try {
    const { email } = userInfo;
    let user = await findUser({ email: email });
    if (!user) {
      const userData = {
        first_name: userInfo.given_name,
        last_name: userInfo.family_name,
        email: userInfo.email,
        source: userInfo.provider,
      };
      user = await createUser(userData);
    }
    console.log("user in database", user);
    let token = jwt.sign(user, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    logger.error(["src > services > userService > 21", error.message]);
  }
};

const findUserByEmail = async (email) => {
  try {
    const filter = {
      email: email,
    };
    const result = await findUser(filter);
    return result;
  } catch (error) {
    logger.error([
      "error in fetching user by email in userService",
      error.message,
    ]);
    throw Error(error?.message);
  }
};

const findUserById = async (id) => {
  try {
    const filter = {
      id: id,
    };
    const result = await findUser(filter);
    return result;
  } catch (error) {
    logger.error([
      "error in fetching user by id in userService",
      error.message,
    ]);
    throw Error(error?.message);
  }
};

const sendMailToUser = async (email) => {
  try {
    await sendOTPMail(email);
  } catch (error) {
    logger.error(["error in userService > sendMailToUser ", error.message]);
  }
};

const passwordChange = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData?.password, 10);
    const updatedUser = await updateUserByEmail(userData.email, {
      ...userData,
      password: hashedPassword,
    });
    console.log(updatedUser);
    return updatedUser;
  } catch (error) {
    logger.error(["error in userService > passwordChange > ", error.message]);
    throw Error(error);
  }
};

const profileUpdateService = async (userData) => {
  try {
    const id = userData?.id;
    if (userData?.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      userData.password = hashedPassword;
    }
    const updatedUser = await updateUserById(id, userData);
    return updatedUser;
  } catch (error) {
    logger.error([
      "error in userService > profileUpdateService > ",
      error.message,
    ]);
    throw Error(error);
  }
};

const ContactUser = async (userInfo) => {
  try {
    const ContactUs = await UserContact(userInfo);
    console.log("Contact Us in Service ", ContactUs);
    if (ContactUs) {
      const transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com", // Replace with your Hostinger SMTP server
        port: 465, // Use 587 for TLS or 465 for SSL
        secure: true, // true for SSL
        auth: {
            user: process.env.MAIL_USER, // Your Hostinger email
            pass: process.env.MAIL_PASS, // Your email password
        },
      });

      const UsermailOptions = {
        from: process.env.MAIL_USER,
        to: `${userInfo.email}`,
        subject: `Message From SkillBuilder`,
        html: `<h3>Hello ${userInfo.firstName} ${userInfo.lastName},</h3>
                 <p>Thank you for contacting us. We have received your email. Our team will review it shortly and contact you as soon as possible.</p>`,
      };
      const AdminmailOptions = {
        from: `${userInfo.email}`,
        to: `${process.env.MAIL_USER} }  `,
        subject: `${userInfo.subject}`,
        html: `<h3>New Message From ${userInfo.firstName} ${userInfo.lastName},</h3>
               <p>${userInfo.text}</p>`,
      };

      await transporter.sendMail(UsermailOptions);
      await transporter.sendMail(AdminmailOptions);
      logger.info(`Email Successfully Send to ${userInfo.email}`);
      return "A mail has successfully being sent to the user.";
    }
  } catch (error) {
    logger.error("Error sending verification email:", error);
    throw error;
  }
};

const getStudentsByInstructorIdService = async ({ instructorId }) => {
  try {
    const isInstructor = await dataSource
      .getRepository("Instructor")
      .findOne({ where: { id: instructorId } });

    if (!isInstructor) {
      return {
        status: 404,
        message: "instructor not found",
      };
    }
    const coursesByInst = await findAllCoursesByInst(instructorId);
    console.log("courses by a particular instructor:", coursesByInst);

    if (!coursesByInst) {
      return {
        status: 404,
        message:
          "course has not been uploaded by the instructor so no enrolled students found",
      };
    }

    let studentsIdEnrolled = [];

    coursesByInst.forEach((course) => {
      if (course.enrolled_customers.length > 0) {
        const enrolledCustomers = Array.isArray(course.enrolled_customers)
          ? course.enrolled_customers
          : JSON.parse(course.enrolled_customers);
        const studentIds = enrolledCustomers.map(
          (customer) => customer.student_id
        );
        studentsIdEnrolled = [...studentsIdEnrolled, ...studentIds];
      }
    });

    if (studentsIdEnrolled.length == 0) {
      return {
        status: 404,
        message: "no enrolled students yet",
      };
    }
    const studentDetailsPromises = studentsIdEnrolled.map((student_id) =>
      findUser({ id: student_id })
    );
    const studentsDetails = await Promise.all(studentDetailsPromises);

    console.log("students details:", studentsDetails);
    return {
      status: 200,
      message: "enrolled course fetched successfully",
      data: studentsDetails,
    };
  } catch (err) {
    console.log(
      "Error fetching students based on a particular instructor id:",
      err
    );
    return "Error fetching students based on a particular instructor id:", err;
  }
};

async function getEnrolledStudentsService() {
  try {
    const courses = await findAllCourses();
    let studentsIdEnrolled = [];

    courses.forEach((course) => {
      if (course.enrolled_customers) {
        const enrolledCustomers = Array.isArray(course.enrolled_customers)
          ? course.enrolled_customers
          : JSON.parse(course.enrolled_customers);
        const studentIds = enrolledCustomers.map(
          (customer) => customer.student_id
        );
        studentsIdEnrolled = [...studentsIdEnrolled, ...studentIds];
      }
    });

    const studentDetailsPromises = studentsIdEnrolled.map((student_id) =>
      findUser({ id: student_id })
    );
    const studentsDetails = await Promise.all(studentDetailsPromises);

    console.log("students details:", studentsDetails);
    return studentsDetails;
  } catch (err) {
    console.log(
      "Error fetching students based on a particular instructor id:",
      err
    );
    return "Error fetching students based on a particular instructor id:", err;
  }
}

const getOneInstCourseStudentsService = async ({
  instructor_id,
  course_id,
}) => {
  try {
    console.log("request query: ", { instructor_id, course_id });
    const coursesByInst = await findAllCoursesByInst(instructor_id);
    console.log("courses by a particular instructor:", coursesByInst);

    let foundCourse;
    coursesByInst.forEach((course) => {
      console.log(
        "condition : course_id === course?.id",
        course_id == course?.id
      );
      if (course_id == course?.id) {
        foundCourse = course;
        console.log(
          "found course:",
          foundCourse,
          "\n\nand its students are:",
          coursesByInst?.enrolled_customers
        );
      } else {
        return {
          status: 400,
          message: "Course doesn't exist.",
        };
      }
    });

    if (foundCourse && foundCourse?.enrolled_customers) {
      console.log(
        "found course:",
        foundCourse,
        "\n\nand its students are:",
        coursesByInst?.enrolled_customers
      );
      return {
        status: 200,
        message: foundCourse?.enrolled_customers,
      };
    }
  } catch (err) {
    console.log(
      "Error fetching students based on a particular instructor id and a particular course:",
      err
    );
    return (
      "Error fetching students based on a particular instructor id and a particular course:",
      err
    );
  }
};

// setStudentStatusService

const setStudentStatusService = async ({ id, status, status_desc }) => {
  try {
    
    const enrolledStudents = await getEnrolledStudentsService();
    console.log("enrolled students:", enrolledStudents);
    let requestedUser;

    const result = await findOneUser(id);
    if (result?.id) {
      const declineResult = await setUserStatusRepository(
        requestedUser,
        enrolledStudents,
        id,
        status,
        status_desc
      );
      console.log("[RESULT OF DECLINING]:", declineResult);
      return {
        message: declineResult,
        status: 200,
      };
    } else {
      console.log("[STUDENT NOT FOUND]");
      return {
        message: "[STUDENT NOT FOUND]",
        status: 400,
      };
    }
  } catch (err) {
    console.log("[SOME ERROR OCCURED WHILE CHANGING THE STATUS]:", err);
    return {
      message: "[SOME ERROR OCCURED WHILE CHANGING THE STATUS]",
      status: 500,
    };
  }
};

const getStudentEnrolledCoursesOnInstructorService = async (
  instructor_id,
  student_id
) => {
  const instructor = await findInstructorByInstructorId(instructor_id);
  const student = await findUserById(student_id);
  if (!instructor) {
    return {
      status: 404,
      message: "instructor not found. Please put instructor id",
    };
  }

  if (!student) {
    return {
      status: 404,
      message: "student not found. Please put user id",
    };
  }

  if (!instructor && !student) {
    return {
      status: 404,
      message:
        "student and instructor not found. Please put user id and instructor id",
    };
  }

  const enrolled_courses = await studentEnrolledCoursesOnInstructorRepository(
    instructor_id,
    student_id
  );

  if (!enrolled_courses) {
    return {
      status: 404,
      message: "inst has not uploaded the courses",
    };
  }
  return {
    status: enrolled_courses.status,
    message: enrolled_courses.message,
    data: enrolled_courses.data,
  };
};

module.exports = {
  createGoogleUser,
  emailVerificationForRegister,
  createUserAfterVerification,
  findAllUser,
  UserLogin,
  findUserByEmail,
  findUserById,
  sendMailToUser,
  passwordChange,
  profileUpdateService,
  ContactUser,
  getOneUserService,
  sendEmailService,
  enrollInCourseService,
  getStudentsByInstructorIdService,
  getOneInstCourseStudentsService,
  getEnrolledStudentsService,
  setStudentStatusService,
  getStudentEnrolledCoursesOnInstructorService,
  googleAuthService
};
