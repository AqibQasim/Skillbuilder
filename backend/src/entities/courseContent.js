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
    title: {
      type: "varchar"  
    },
    content_type: {
      type: "varchar",
    },
    content: {
      type: "varchar",
    },
    module_id: {
      type: "int",
    },
    order: {
      type: "int",
    },
  },
  relations: {
    modules: {
      target: "content_module",
      type: "many-to-one",
      joinColumn: {
        name: "module_id",
      },
    },
  },
});
