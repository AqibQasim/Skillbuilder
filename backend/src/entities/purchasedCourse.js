const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "purchased_course",
  name: "purchased_course",
  tableName: "purchased_course",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    purchased_by: {
      type: 'int'
    },
    course_id: {
      type: 'int'
    },
    created_at: {
      type: "timestamp with time zone",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one", 
      joinColumn: {
        name: "user_id"
      },
    },
    purchased_courses: {
      target: "Course",
      type: "one-to-many",
      inverseSide: "purchased_courses",
    },
  },
});
