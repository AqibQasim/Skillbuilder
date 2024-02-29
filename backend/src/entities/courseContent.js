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
      inverseSide: "courseContent",
      cascade: true,
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
