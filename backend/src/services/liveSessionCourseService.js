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
        const savedLiveSessionCourseModule =
          await liveSessionCourseModuleRepository.save(liveSessionCourseModule);
        if (savedLiveSessionCourseModule) {
          return {
            status: 200,
            message: "Live courses created successfully",
          };
        }
      }
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
    const getLiveCourses = await liveSessionCourseModuleRepository
      .createQueryBuilder("live-content-module")
      .leftJoinAndSelect(
        "live-content-module.course",
        "course",
        "course.id = live-content-module.live_session_course_id"
      )
      .leftJoinAndSelect(
        "course.instructor",
        "instructor",
        "course.instructor_id = instructor.id"
      )
      //.select()
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
    const {course_id}= req?.params;
    try {
      const getLiveCourses = await liveSessionCourseModuleRepository
        .createQueryBuilder("live-content-module")
        .leftJoinAndSelect(
          "live-content-module.course",
          "course",
          "course.id = live-content-module.live_session_course_id"
        )
        .leftJoinAndSelect(
          "course.instructor",
          "instructor",
          "course.instructor_id = instructor.id"
        )
        .where("course.id=:id",{id:course_id})
        //.select()
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

module.exports = { createLiveSessionCourse, getLiveSessionCourse, getLiveSessionCourseById };
