const dataSource = require("../../Infrastructure/postgres");

const courseRepository = dataSource.getRepository("Course");

const searchCourse = async (courseName) => {
  if (!courseName) {
    return null;
  }

  const courses = await courseRepository
    .createQueryBuilder("course")
    .innerJoinAndSelect("course.instructor", "instructor")
    .innerJoinAndSelect("instructor.user", "user", "instructor.user_id=user.id")
    .where("course.title ILIKE :courseName", { courseName: `%${courseName}%` })
    .orWhere("course.learning_outcomes::text ILIKE :courseName", {
      courseName: `%${courseName}%`,
    })
    .orWhere("course.description ILIKE :courseName", {
      courseName: `%${courseName}%`,
    })
    .andWhere("course.status='approved'")
    .getMany();

  if (courses?.length === 0) {
    return {
      status: 404,
      message: "course not found",
    };
  }

  return {
    status: 200,
    message: "course found",
    data: courses[0],
  };
};

const searchCourses = async (courseNames) => {
  if (!courseNames?.length === 0) {
    return null;
  }

  const courseArray = courseNames?.split(/\[|\]|\,/);
  const coursearrayLength = courseArray?.length - 2;
  const parsedCourseArray = courseArray?.splice(1, coursearrayLength);

  console.log(parsedCourseArray);

  let courseResults = [];
  for (let courseName of parsedCourseArray) {
    const courses = await courseRepository
      .createQueryBuilder("course")
      .innerJoinAndSelect("course.instructor", "instructor")
      .innerJoinAndSelect(
        "instructor.user",
        "user",
        "instructor.user_id=user.id"
      )
      .where("course.title ILIKE :courseName", {
        courseName: `%${courseName?.toString()}%`,
      })
      .orWhere("course.learning_outcomes::text ILIKE :courseName", {
        courseName: `%${courseName?.toString()}%`,
      })
      .andWhere("course.status='approved'")
      .getMany();
    console.log(courses);
    if (courses?.length > 0) {
      courseResults = [...courseResults, ...courses];
    }
  }

  if (courseResults?.length === 0) {
    return {
      status: 404,
      message: "topics not found",
    };
  }

  return {
    status: 200,
    message: "topics found",
    data: courseResults,
  };
};

module.exports = { searchCourse, searchCourses };
