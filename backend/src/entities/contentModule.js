const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "content_module",
  name: "content_module",
  tableName: "content_module",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    course_id: {
      type: "int",
    },
    title: {
      type: "varchar",
    },
  },
  relations: {
    course: {
      target: "Course",
      type: "many-to-one", 
      joinColumn: {
        name: "course_id",
      },
    },
    content: {
      target: "course_content",
      type: "one-to-many",
      inverseSide: "modules",
    },
  },
});
