const { EntitySchema, ManyToMany, JoinTable } = require("typeorm");
const Instructor = require("./instructor");
const instructor = require("./instructor");

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
  }
  // @ManyToMany(()=> course_instructor,(Instructor)=> instructor.Course,{
  //   cascade:true, eager:true })
  //   @JoinTable()
  //   course_instructor:Instructor[];
  
  // relations: {
  //   instructors: {
  //     target: "Instructor",
  //     type: "many-to-many",
  //     cascade: true,
  //     joinTable: {
  //       name: "course_instructor", // Specify the name of the join table
  //       joinColumn: { name: "course_id" }, // Specify the join column in the join table
  //       inverseJoinColumn: { name: "instructor_id" }, // Specify the inverse join column in the join table
  //     },
  //   },
  // },
});

