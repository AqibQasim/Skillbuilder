const { EntitySchema } = require("typeorm");
const Course = require("./Course");

module.exports = new EntitySchema({
  target: "course_content",
  name: "course_content",
  tableName: "course_content",
  columns: {
    id: {
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
      type: "many-to-one", //multiple course Content and one course
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
