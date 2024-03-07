const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Instructor",
  name: "Instructor",
  tableName: "Instructor",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    image: {
      type: "varchar",
    },
    name: {
      type: "varchar",
    },
    rating: {
      type: "decimal",
      precision: 5,
      scale: 2,
    },
    email: {
      type: "varchar",
    },
    bio: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    profession: {
      type: "varchar",
    },
  },
  relations: {
    reviews: {
      target: "Review",
      type: "one-to-many",
      inverseSide: "instructor",
    },
  },
});
