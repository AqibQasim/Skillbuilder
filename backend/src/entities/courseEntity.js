// Course entity schema
const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Course",
  name: "Course",
  tableName: "course",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    amount: {
      type: "int",
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    discount: {
      type: "decimal",
    },
    active: {
      type: "boolean",
    },
    image: {
      type: "varchar",
    },
    course_length: {
      type: "int",
    },
    rating: {
      type: "decimal",
      precision: 3,
      scale: 1,
    },
    created_at: {
      type: "timestamp with time zone",
    },
    updated_at: {
      type: "timestamp with time zone",
      nullable: true,
    },
    created_by: {
      type: "varchar",
      nullable: true,
    },
    updated_by: {
      type: "varchar",
      nullable: true,
    },
    instructor_id: {
      type: "int", // Add instructor_id field to store the foreign key
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one", // Each Course belongs to one Instructor
      joinColumn: {
        name: "instructor_id",
      },
    },
    reviews: {
      target: "courseReviews",
      type: "one-to-many", // Each Course has many CourseReviews
      cascade: true,
      inverseSide: "course",
    },
  },
});
