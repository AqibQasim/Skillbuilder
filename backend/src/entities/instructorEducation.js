const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "instructor_education",
  name: "instructor_education",
  tableName: "instructor_education",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    instructor_id: {
      type: 'int'
    },
    percentage: {
      type: "decimal", 
      precision: 4,
      scale: 2,
    },
    degree: {
      type: "varchar",
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      joinColumn: {
        name: "instructor_id",
      },
    },
  },
});
