const dataSource = require("../../Infrastructure/postgres");
const { findByFilter } = require("./instructorRepository");
const purchasedCourseRepo = dataSource.getRepository("purchased_course");

const create = async (payload) => {
  const create = await purchasedCourseRepo.create(payload);
  const result = await purchasedCourseRepo.save(create);
  return result;
};

const createProgressOfStudentOnCourse= async(payload)=>{
  const {course_id,user_id}= payload;
  const course_contents_of_course= await dataSource.getRepository('course_content')
  .createQueryBuilder('course_content')
  .innerJoin('course_content.modules','course_modules','course_modules.id=course_content.module_id')
  .innerJoin('course_modules.course','course','course_modules.course_id=course.id')
  .select()
  .getMany();
  
  const student_video_progress = dataSource.getRepository("student_video_progress");

  for(let content of course_contents_of_course){
    const create = await student_video_progress.create({
      user_id,
      course_id,
      course_content_id: content.id
    });
    await student_video_progress.save(create);

  }

  console.log("//////////////////////////////////////////////",course_contents_of_course)
}

const findAll = async (filter) => {
  const result = await purchasedCourseRepo.find(filter);
  return result;
};

const findOneByFilter = async (filter) => {
  const result = await purchasedCourseRepo.findOne(filter);
  return result;
};

const deleteOne = async (filter) => {
  const result = await purchasedCourseRepo.delete(filter);
  return result;
};

const purchaseCourseDetailsRepository = async (user_id) => {
  const purchasedCourses = await dataSource
    .getRepository("purchased_course")
    .createQueryBuilder("purchased_course")
    .innerJoinAndSelect("purchased_course.user", "user")
    .innerJoinAndSelect("purchased_course.course", "course")
    .innerJoinAndSelect("course.instructor", "instructor") // Join with instructor table
    .innerJoinAndSelect("instructor.user", "instructor_user") // Join with user table for instructor details
    .select([
      "purchased_course.id",
      "purchased_course.created_at",
      "user.id",
      "course.id",
      "course.amount",
      "course.discount",
      "course.description",
      "course.created_at",
      "course.image",
      "course.title",
      "course.instructor_id",
      "instructor.id", // Instructor's id
      "instructor_user.first_name", // Instructor's first name
      "instructor_user.last_name", // Instructor's last name
    ])
    .where("purchased_course.purchased_by = :user_id", { user_id: user_id })
    .getMany();

  if (purchasedCourses.length > 0) {
    return purchasedCourses;
  }
  return null;
};

module.exports = {
  create,
  findAll,
  findOneByFilter,
  deleteOne,
  purchaseCourseDetailsRepository,
  createProgressOfStudentOnCourse
};
