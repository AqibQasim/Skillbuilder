const { logger } = require("../../logger");
const { getConnection } = require("typeorm");
const { Instructor } = require("../entities/instructorEntity");
const dataSource = require("../../Infrastructure/postgres");

const readInstructorWithReviews = async (id) => {
  try {
    const instructorRepository = dataSource.getRepository("Instructor");

    const instructor = await instructorRepository
      .createQueryBuilder("instructor")
      .leftJoinAndSelect("instructor.reviews", "review")
      .leftJoinAndSelect("review.user", "user")
      .where("instructor.id = :id", { id })
      .select([
        "instructor.id",
        "instructor.name",
        "instructor.email",
        "instructor.image",
        "instructor.rating",
        "instructor.bio",
        "instructor.profession",
      ])
      .addSelect([
        "review.id",
        "review.title",
        "review.comment",
        "review.rating",
        "review.date",
      ])
      .addSelect(["user.id", "user.name", "user.email"])
      .getOne();

    return instructor;
  } catch (error) {
    console.error("Error reading instructor from database:", error.message);
    throw new Error("Error reading instructor from database");
  }
};

const readInstructors = async () => {
  try {
    const instructorRepository = dataSource.getRepository("Instructor");

    const instructors = await instructorRepository
      .createQueryBuilder("instructor")
      .select([
        "instructor.id",
        "instructor.name",
        "instructor.email",
        "instructor.image",
        "instructor.rating",
        "instructor.bio",
        "instructor.profession",
      ])
      .getMany();

    return instructors;
  } catch (error) {
    console.error("Error reading instructors from database:", error.message);
    throw new Error("Error reading instructors from database");
  }
};

module.exports = {
  readInstructors,
  readInstructorWithReviews,
};
