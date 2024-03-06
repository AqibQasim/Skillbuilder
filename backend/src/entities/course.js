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
    rating:{
      type:"decimal",
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
      type: "many-to-one",    //It should be one to one
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
