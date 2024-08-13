const dataSource = require("../../Infrastructure/postgres");
const { findByFilter } = require("./instructorRepository");
const purchasedCourseRepo = dataSource.getRepository("purchased_course");

const create = async (payload) => {
  const create = await purchasedCourseRepo.create(payload);
  const result = await purchasedCourseRepo.save(create);
  return result;
};

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
    const purchasedCourses = await dataSource.getRepository("purchased_course")
      .createQueryBuilder("purchased_course")
      .innerJoinAndSelect("purchased_course.user", "user")
      .innerJoinAndSelect("purchased_course.course", "course")
      
      //.innerJoinAndSelect("")
      .select([
        "purchased_course.id",
        "user.id",
        // "user.first_name",
        // "user.last_name",
        // "user.profile",
        // "user.email",
        // "user.profession",
        // "user.facebook_profile",
        // "user.is_active",
        // "user.role",
        // "user.source",
        // "user.created_at",
        // "user.updated_at",
        "course.id",        // Course details
        //"course.name",
        "course.description",
        "course.created_at",
        "course.image",
        "course.title",
        "course.image",
        "course.instructor_id"
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
};
