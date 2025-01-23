const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "CareerCounsellingPayments",
  name: "career-counselling-payments",
  tableName: "CareerCounsellingPayments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    student_id: {
      type: "int",
    },
    instructor_id: {
      type: "int",
      nullable: true,
    },
    amount: {
      type: "int",
      default: 25,
    },
    booking_date: {
      type: "varchar",
      nullable: true,
    },
    booking_time: {
      type: "varchar",
      nullable: true,
    },
    recruitinn_summary: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    student: {
      target: "User", // Entity name for User
      type: "many-to-one", // A student can have many career counselling payments
      joinColumn: {
        name: "student_id", // Maps to `student_id` in the table
        referencedColumnName: "id",
      },
    },
    instructor: {
      target: "Instructor", // Entity name for Instructor
      type: "many-to-one", // An instructor can have many career counselling payments
      joinColumn: {
        name: "instructor_id", // Maps to `instructor_id` in the table
        referencedColumnName: "id",
      },
    },
  },
});
