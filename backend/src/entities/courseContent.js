const { EntitySchema } = require("typeorm");
const Course = require("./course");

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
    course: {
      target: "Course",
      type: "many-to-one", // many course contents belong to one course
      joinColumn: {
        name: "course_id",
        referencedColumnName: "id", // referencing the id column of Course
      },

    },
  },
});
