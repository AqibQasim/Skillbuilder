const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Skills",
  tableName: "skills",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
    },
    icon: {
      type: "varchar",
    },
  },
  relations: {
    instructor: {
      target: "instructor",
      type: "many-to-one",
    },
  },
});
