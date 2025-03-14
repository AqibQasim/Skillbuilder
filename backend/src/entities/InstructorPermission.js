const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "InstructorPermission",
  tableName: "instructor_permissions",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    instructor_id: {
      type: "int",
    },
    type: {
      type: "enum",
      enum: ["courses", "live_sessions", "career_counselling"],
    },
    status: {
      type: "enum",
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
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
