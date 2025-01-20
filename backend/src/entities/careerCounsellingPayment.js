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
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    student: {
      target: "User",
      type: "one-to-many",
      //inverseSide: "carts",
      joinColumn: {
        name: "student_id",
        referencedColumnName: "id",
      },
    },
    instructor: {
      target: "Instructor",
      type: "one-to-many",
      //inverseSide: "carts",
      joinColumn: {
        name: "instructor_id",
        //referencedColumnName: "id",
      },
    },
  },
});
