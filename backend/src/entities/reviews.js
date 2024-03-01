const { EntitySchema } = require("typeorm");
const User = require("../entities/userEntity");
const Course = require("../entities/course");

module.exports = new EntitySchema({
  target: "Reviews",
  name: "reviews",
  tableName: "reviews",
  columns: {
    review_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    rating: {
      type: "decimal", // Use "decimal" for decimal numbers
      precision: 3,
      scale: 1,
    },
    comment: {
      type: "varchar",
    },
    date: {
      type: "timestamp",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "user_id",
      },
    },
    course: {
      target: "Course",
      type: "many-to-one",
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
