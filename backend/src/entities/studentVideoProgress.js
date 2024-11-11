const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  target: "StudentVideoProgress",
  name: "student_video_progress",
  tableName: "student_video_progress",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    course_content_id: {
      type: "int",
    },
    is_completed: {
      type: "boolean",
      default: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    },
    course_content: {
      target: "course_content",
      type: "many-to-one",
      joinColumn: {
        name: "course_content_id",
        referencedColumnName: "id",
      },
    },
  },
});
