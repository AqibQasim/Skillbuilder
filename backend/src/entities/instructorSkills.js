const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "instructor_skills",
  name: "instructor_skills",
  tableName: "instructor_skills",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    instructor_id: {
      type: 'int'
    },
    title: {
      type: "varchar",
    },
    percentage: {
      type: "varchar",
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      joinColumn: { name: "instructor_id" },
    },
  },
});
