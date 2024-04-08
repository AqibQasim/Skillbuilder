const { EntitySchema } = require("typeorm");
const Skills = require("./skills"); // Assuming "skills" is the name of the Skills entity file

module.exports = new EntitySchema({
  name: "Instructor",
  tableName: "instructor",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    profile: {
      type: "varchar",
    },
    name: {
      type: "varchar",
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
    skills: {
      target: "Skills",
      type: "one-to-many",
      cascade: true,
      inverseSide: "instructor", 
    },
    reviews:{
      target: "Reviews",
      type: "one-to-many",
      cascade: true,
      inverseSide: "instructor", 
    }
  },
})