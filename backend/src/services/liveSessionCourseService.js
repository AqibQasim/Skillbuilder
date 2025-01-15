const dataSource = require("../../Infrastructure/postgres");

const liveSessionCourseRepository = dataSource.getRepository("live-course");
const liveSessionCourseModuleRepository = dataSource.getRepository(
  "live-content-module"
);

const createLiveSessionCourse = async (req) => {
  const {
    instructor_id,
    title,
    description,
    category,
    amount,
    discount,
    image,
    video_url,
    modulesCount,
    modules,
  } = req.body;

  try {
    const liveSessionCourses = liveSessionCourseRepository.create({
      instructor_id,
      title,
      description,
      category,
      amount,
      discount,
      image,
      video_url,
      modulesCount,
      charges: 0,
      //modules
    });

    const savedLiveSessionCourse = await liveSessionCourseRepository.save(
      liveSessionCourses
    );

    if (savedLiveSessionCourse) {
      for (let module of modules) {
        const liveSessionCourseModule =
          liveSessionCourseModuleRepository.create({
            title: module?.title,
            description: module?.description,
            live_session_course_id: savedLiveSessionCourse?.id,
          });
        await liveSessionCourseModuleRepository.save(liveSessionCourseModule);
      }
      return {
        status: 200,
        message: "Live courses created successfully",
      };
    }

    return {
      status: 400,
      message: "Course not created",
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: e.message,
    };
  }
};

const getLiveSessionCourse = async () => {
  try {
    const getLiveCourses = await liveSessionCourseRepository
      .createQueryBuilder("live-course")
      .leftJoinAndSelect("live-course.modules", "modules")
      .leftJoinAndSelect("live-course.instructor","instructor")
      .leftJoinAndSelect("instructor.user","user")
      .where("modules.live_session_course_id = live-course.id")
      .getMany();

    return {
      status: 200,
      message: "live courses found",
      data: getLiveCourses,
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message,
    };
  }
};

const getLiveSessionCourseById = async (req) => {
  const { course_id } = req?.params;
  try {
    const getLiveCourses = await liveSessionCourseRepository
      .createQueryBuilder("live-course")
      .leftJoinAndSelect("live-course.modules", "modules")
      .leftJoinAndSelect("live-course.instructor","instructor")
      .leftJoinAndSelect("instructor.user","user")
      .where("modules.live_session_course_id = live-course.id")
      .andWhere("live-course.id=:id",{id: course_id})
      .getOne();

    return {
      status: 200,
      message: "live courses found",
      data: getLiveCourses,
    };
  } catch (e) {
    return {
      status: 500,
      message: e.message,
    };
  }
};

module.exports = {
  createLiveSessionCourse,
  getLiveSessionCourse,
  getLiveSessionCourseById,
};
