const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Instructor",
  tableName: "instructor",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    experience: {
      type: "jsonb",
      default:null,
    },
    specialization: {
      type: "varchar",
    },
    video_url: {
      type: "varchar",
    },
    status: {
      type: "enum",
      enum: ["active", "pending"],
      default: "pending",
    },
    created_at: {
      type: "timestamp",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "one-to-one",
      inverseSide: "instructor",
      joinColumn: {
        name: "user_id",
        referencedColumnName:"id"
      },
    },
    skills: {
      target: "instructor_skills",
      type: "one-to-many",
      inverseSide: "instructor",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "id",
      },
    },
    reviews: {
      target: "instructor_reviews",
      type: "one-to-many",
      inverseSide: "instructor",
      joinColumn: { name: "instructor_id" },
    },
    education: {
      target: "instructor_education",
      type: "one-to-many",
      inverseSide: "instructor",
      joinColumn: { name: "instructor_id" },
    },
    courses: {
      target: "Course",
      type: "one-to-many",
      inverseSide: "instructor",
      joinColumn: { name: "instructor_id" },
    },
  },
});
