const notificationService = require("../services/notificationService");

const createNotification = async (req, res) => {
  const { notification_for_instructor, notification_for_student } = req.body;
  const result_instructor =
    await notificationService.createNotificationInstructor(
      notification_for_instructor
    );
  console.log(result_instructor);
  const result_student = await notificationService.createNotificationStudent(
    notification_for_student
  );
  console.log(result_student);

  if (result_instructor.status === 200 && result_student.status === 200) {
    res.status(result_instructor.status).send({ ...result_instructor });
  }
};

const getNotification = async (req, res) => {
  console.log("hitting....");
  const { instructor_id, student_id } = req.query;
  let notifications = null;
  if (instructor_id) {
    notifications = await notificationService.getNotificationInstructor(
      instructor_id
    );
  }
  if (student_id) {
    notifications = await notificationService.getNotificationStudent(
      student_id
    );
  }

  if (!student_id && !instructor_id) {
    res.status(400).send({
      status: 400,
      message: "either instructor_id or student_id required",
    });
  }

  res.status(notifications.status).send({...notifications});
};

module.exports = {
  createNotification,
  getNotification,
};
