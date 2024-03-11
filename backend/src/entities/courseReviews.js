const { EntitySchema } = require("typeorm");
const User = require("../entities/userEntity");
const Course = require("../entities/courseEntity");

module.exports = new EntitySchema({
  target: "courseReviews",
  name: "courseReviews",
  tableName: "course_reviews",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    rating: {
      type: "decimal",
      precision: 3,
      scale: 1,
    },
    comment: {
      type: "varchar",
    },
    date: {
      type: "timestamp with time zone",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one", //multiple course reviews and one user
      joinColumn: {
        name: "user_id",
      },
    },
    course: {
      target: "Course",
      type: "many-to-one", //multiple course reviews and one course
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
