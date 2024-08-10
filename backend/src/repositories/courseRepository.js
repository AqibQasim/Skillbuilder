const { logger } = require("../../logger");
const dataSource = require("../../Infrastructure/postgres");
const courseContent = require("../entities/courseContent");
const courseRepository = dataSource.getRepository("Course");
const courseRevRep = dataSource.getRepository("courseReviews");
const courseContentRepository = dataSource.getRepository("course_content");

const createCourse = async (data) => {
  try {
    const courseCreating = courseRepository.create(data);
    const courseBasics = await courseRepository.save(courseCreating);
    return courseBasics;
  } catch (error) {
    logger.error("src > repository > courseRepository");
    logger.error(error.message);
    throw new Error(error);
  }
};

const findAllCourses = async () => {
  logger.info("src > Repository > fetchAllCourses");
  try {
    const allCourses = await courseRepository.find();
    return allCourses;
  } catch (error) {
    logger.error("Error : src > repositories > courseRepository");
    logger.error(error.message);
    throw new Error(error);
  }
};

const findAllCoursesByInst = async (id) => {
  logger.info("src > Repository > fetchAllCourses");
  try {
    const allCourses = await courseRepository.find(id);
    return allCourses;
  } catch (error) {
    logger.error("Error : src > repositories > courseRepository");
    logger.error(error.message);
    throw new Error(error);
  }
};

const findOneCourse = async (filter, course_id) => {
  try {
    const updateObject = {};
    updateObject[filter] = course_id;
    console.log("updated object:", updateObject);
    const findOne = await courseRepository.findOne({
      where: updateObject,
      relations: ["instructor", "reviews", "modules.content"],
    });
    return findOne;
  } catch (error) {
    logger.error("Error: src > repositories > courseRepository");
    logger.error(error.message);
    throw new Error(error);
  }
};

const coursesRatingFunc = async () => {
  logger.info("Src > Repository > coursesRatingFunc");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const courses_rating = await courseRepository.find({
      order: {
        rating: "DESC",
      },
    });

    return courses_rating;
  } catch (error) {
    return error;
  }
};

const fetchCourseWithDetailsWithId = async (id) => {
  logger.info("Src > Repository > fetchAllCoursesWithDetails");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const coursesWithDetails = await courseRepository
      .createQueryBuilder("course")
      .where("course.id = :id", { id })
      .leftJoinAndSelect("course.course_content", "course_content")
      .leftJoinAndSelect("course.instructor", "instructor")
      .leftJoinAndSelect("course.reviews", "reviews")
      .leftJoinAndSelect("reviews.user", "user")
      .select([
        "course.id",
        "course.amount",
        "course.title",
        "course.description",
        "course.discount",
        "course.active",
        "course.image",
        "course.rating",
        "course.created_at",
        "course.updated_at",
        "course.created_by",
        "course.updated_by",
        "course_content.id",
        "course_content.content_type",
        "course_content.content",
        "course_content.order",
        "instructor.id",
        "instructor.name",
        "instructor.email",
        "instructor.bio",
        "instructor.profession",
        "reviews.id",
        "reviews.rating",
        "reviews.comment",
        "reviews.date",
        "user.id",
        "user.name",
        "user.email",
        "user.active",
      ])
      .getOne();

    console.log(coursesWithDetails);
    return coursesWithDetails;
  } catch (error) {
    return error;
  }
};

const fetchAllRecentCourses = async () => {
  logger.info("src > Repository > fetchAllRecentCourses");
  try {
    const courseRepository = dataSource.getRepository("Course");
    const coursesWithUpdatedTime = await courseRepository.find({
      order: {
        updated_at: "DESC",
      },
    });

    return coursesWithUpdatedTime;
  } catch (error) {
    return error;
  }
};
4;
const updateCourse = async (courseId, videoUrl) => {
  const courseExist = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!courseExist) {
    return "No such course exists!";
  }

  Object.assign(courseExist, { video_url: videoUrl });

  const updatedCourse = await courseRepository.save(courseExist);
  console.log("updated course:", updatedCourse);
  return "Course has been updated successfully";
};

// const updateCourseProps = async (course_id, filter, ) => {
//   const courseExist = await courseRepository.findOne({
//     where: { id: courseId },
//   });

//   if (!courseExist) {
//     return 'No such course exists!';
//   };

//   Object.assign(courseExist, { video_url: videoUrl });

//   const updatedCourse = await courseRepository.save(courseExist);
//   console.log("updated course:", updatedCourse);
//   return "Course has been updated successfully"
// }

const updateCourseByFilter = async (courseId, filter, value) => {
  const courseExist = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!courseExist) {
    return "No such course exists!";
  }

  console.log("{ filter: value }:", { filter: value });
  Object.assign(courseExist, { [filter]: value });

  const updatedCourse = await courseRepository.save(courseExist);
  console.log("[updated course]:", updatedCourse);
  return "Course has been updated successfully";
};

const setCourseStatusRepository = async (
  courseId,
  status,
  reason,
  status_desc
) => {
  const courseExist = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!courseExist) {
    return "No such course exists!";
  }

  // console.log('{ filter: value }:',{ filter: value })
  Object.assign(courseExist, {
    reason: reason,
    status: status,
    status_desc: status_desc,
  });

  const updatedCourse = await courseRepository.save(courseExist);
  console.log("[updated course]:", updatedCourse);
  return "Course has been updated successfully";
};

const updateCoursecontent = async (courseId, moduleInfo) => {
  const courseRepository = dataSource.getRepository("Course");
  const contentModuleRepository = dataSource.getRepository("content_module");
  const courseContentRepository = dataSource.getRepository("course_content");

  const courseExist = await courseRepository.findOne({
    where: { id: courseId },
  });

  if (!courseExist) {
    return "No such course exists!";
  }

  for (const module of moduleInfo.modules) {
    const moduleEntity = contentModuleRepository.create({
      course_id: courseId,
      title: module.title,
    });

    const savedModule = await contentModuleRepository.save(moduleEntity);
    console.log("[CREATED MODULE]:", savedModule);

    for (const content of module.content) {
      console.log("[CONTENT]:", content.content);
      const contentEntity = courseContentRepository.create({
        title: content.title,
        content: content.content,
        module_id: moduleEntity.id,
      });

      const savedContent = await courseContentRepository.save(contentEntity);
      console.log("[CREATED CONTENT]:", savedContent);
    }
  }

  return "Course has been updated successfully";
};

module.exports = {
  createCourse,
  findAllCourses,
  findOneCourse,
  coursesRatingFunc,
  fetchCourseWithDetailsWithId,
  fetchAllRecentCourses,
  findAllCoursesByInst,
  updateCourse,
  updateCoursecontent,
  updateCourseByFilter,
  setCourseStatusRepository,
  // saveReview
};
