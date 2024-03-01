const { EntitySchema } = require("typeorm");
const Course = require("./course");

module.exports = new EntitySchema({
  target: "CourseContent",
  name: "courseContent",
  tableName: "courseContent",
  columns: {
    content_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content_type: {
      type: "varchar",
    },
    content: {
      type: "varchar",
    },
    order: {
      type: "int",
    },
  },
  relations: {
    courses: {
      target: "Course",
      type: "one-to-many",
      inverseSide: "courseContent", // Specify the inverse side property in the Course entity
      cascade: true,
      joinColumn: {
        name: "content_id", // Add join column name
      },
    },
  },
});
