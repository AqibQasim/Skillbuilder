const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Course",
  name: "course",
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
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one", //multiple courses one instructor
      cascade: true,
      joinColumn: {
        name: "instructor_id",
      },
    },
    reviews: {
      target: "courseReviews",
      type: "one-to-many", //one courses multiple reviews
      cascade: true,
      inverseSide: "course",
    },
    course_content: {
      target: "course_content",
      type: "one-to-many",
      cascade: true,
      inverseSide: "course",
    },
  },
});
