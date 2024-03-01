const { EntitySchema } = require("typeorm");
const Course = require("./course");

module.exports = new EntitySchema({
  target: "course_content",
  name: "course_content",
  tableName: "course_content",
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
      type: "many-to-one",
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
