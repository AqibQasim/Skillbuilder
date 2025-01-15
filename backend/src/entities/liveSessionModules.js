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
    live_session_course_id: {
      type: "int",
      joinColumn: {
        name: "live_session_course_id",
        referencedColumnName: "id",
      },
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
  },
  relations: {
    course: {
      target: "live-course",
      type: "many-to-one",
      joinColumn: {
        name: "live_session_course_id",
      },
    },
    // content: {
    //   target: "course_content",
    //   type: "one-to-many",
    //   inverseSide: "modules",
    // },
  },
});
