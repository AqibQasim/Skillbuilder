const { EntitySchema } = require("typeorm");
const User = require("../entities/userEntity");
const Course = require("../entities/course");

module.exports = new EntitySchema({
  target: "courseReviews",
  name: "course_reviews",
  tableName: "course_reviews",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,  
    },
    rating: {
      type: "decimal",
      precision: 3,
      scale: 1,
    },
    review: {
      type: "varchar",
    },
    date: {
      type: "timestamp with time zone",
      default: () => "CURRENT_TIMESTAMP"
    },
    course_id: {
      type: "int"
    },
    user_id:{
      type:"int"
    }
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one", // multiple course reviews and one user
      joinColumn: {
        name: "user_id",
      },
    },
    course: {
      target: "Course",
      type: "many-to-one", // multiple course reviews and one course
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
