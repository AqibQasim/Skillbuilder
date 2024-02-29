const { EntitySchema } = require("typeorm");
const Instructor = require("./instructor");

module.exports = new EntitySchema({
  target: "Course",
  name: "course",
  tableName: "course",
  columns: {
    course_id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    discount: {
      type: "decimal",
    },
    active: {
      type: "boolean",
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      cascade: true,
      joinColumn: {
        name: "instructor_id",
      },
    },
  },
});
