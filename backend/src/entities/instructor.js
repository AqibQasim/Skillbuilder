const { EntitySchema } = require("typeorm");
const Skills = require("./instructorSkills"); // Assuming "skills" is the name of the Skills entity file

module.exports = new EntitySchema({
  target: "Instructor",
  name: "Instructor",
  tableName: "instructor",
  
  columns: {
    id: {
        primary: true,
        type: "int",
    },
    experience: {
        type: "varchar"
    },
    specialization: {
        type: "varchar"
    },
    video_url: {
        type: "varchar"
    },
    status: {
      type: "varchar",
      enum: ['active', 'pending'],
      default: 'pending'
    },
    created_at: {
        type: "timestamp"
    }
  },

  relations: {
    user: {
        target: "User",
        type: "one-to-one",
        inverseSide: 'instructor'
    },
    skills: {
      target: "instructor_skills",
      type: "one-to-many",
      inverseSide: "instructor",
    },
    reviews: {
      target: "instructor_reviews",
      type: "one-to-many",
      inverseSide: "instructor",
    },
    education: {
      target: "instructor_education",
      type: "one-to-many",
      inverseSide: "instructor",
    },
    courses: {
      target: "Course",
      type: "one-to-many",
      inverseSide: "instructor",
    }
  },
});
