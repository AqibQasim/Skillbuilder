const { EntitySchema } = require("typeorm");
const Instructor = require("./instructor");
const Reviews = require("./reviews");

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
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      cascade: true,
      joinColumn: {
        name: "instructor_id",
      },
    },
    reviews: {
      target: "Reviews",
      type: "one-to-many",
      cascade: true,
      inverseSide: "course",
    },
  },
});
