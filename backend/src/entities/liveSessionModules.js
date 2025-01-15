const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "live-content-module",
  name: "live-content-module",
  tableName: "live-content-module",
  columns: {
    id: {
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
    live_session_course_id: {
      type: "int",
      joinColumn: {
        name: "live_session_course_id",
        referencedColumnName: "id",
      },
    },
  },
  relations: {
    live_course: {
      target: "live-course",
      type: "many-to-one",
      joinColumn: {
        name: "live_session_course_id",
      },
    },
  },
});
