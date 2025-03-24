const liveSessionCourseService = require("../services/liveSessionCourseService");

const createLiveSessionCourse = async (req, res) => {
  const result = await liveSessionCourseService.createLiveSessionCourse(req);
  return res.status(result?.status).send({ ...result });
};

const getLiveSessionCourse = async (req, res) => {
  const result = await liveSessionCourseService.getLiveSessionCourse();
  return res.status(result?.status).send({ ...result });
};

const getLiveSessionCourseById = async (req, res) => {
  const result = await liveSessionCourseService.getLiveSessionCourseById(req);
  return res.status(result?.status).send({ ...result });
};

const getLiveSessionCourseOfInstrcutor = async (req, res) => {
  const result = await liveSessionCourseService.getLiveSessionCourseOfInstrcutor(req);
  return res.status(result?.status).send({ ...result });
};

const getLiveSessionCourseEnrolledStudents = async (req, res) => {
  const result =
    await liveSessionCourseService.getLiveSessionCourseEnrolledStudents(req);
  return res.status(result?.status).send({ ...result });
};

module.exports = {
  createLiveSessionCourse,
  getLiveSessionCourse,
  getLiveSessionCourseById,
  getLiveSessionCourseOfInstrcutor,
  getLiveSessionCourseEnrolledStudents,
};
