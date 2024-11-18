const dataSource = require("../../Infrastructure/postgres");

const notificationStudentRepository = dataSource.getRepository(
  "notifications-student"
);
const notificationInstructorRepository = dataSource.getRepository(
  "notifications-instructor"
);

const createNotificationInstructor = async (body) => {
  const { notification_message, notification_title, instructor_id } = body;
  try {
    const create_notification = notificationInstructorRepository.create({
      notification_title,
      notification_message,
      instructor_id,
    });
    const save = await notificationInstructorRepository.save(
      create_notification
    );

    return {
      status: 200,
      message: "notification created successfully",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};

const getNotificationInstructor = async (instructor_id) => {
  try {
    const notifications = await notificationInstructorRepository.find({
      where: {
        instructor_id,
      },
    });

    return {
      status: 200,
      message: "notification fetched successfully",
      data: notifications,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};

const getNotificationStudent = async (student_id) => {
  try {
    const notifications = await notificationStudentRepository.find({
      where: {
        student_id,
      },
    });

    return {
      status: 200,
      message: "notification fetched successfully",
      data: notifications,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};

const createNotificationStudent = async (body) => {
  const { notification_message, notification_title, student_id } = body;
  try {
    const create_notification = notificationStudentRepository.create({
      notification_title,
      notification_message,
      student_id,
    });
    const save = await notificationStudentRepository.save(create_notification);

    return {
      status: 200,
      message: "notification created successfully",
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
  createNotificationInstructor,
  createNotificationStudent,
  getNotificationInstructor,
  getNotificationStudent,
};
