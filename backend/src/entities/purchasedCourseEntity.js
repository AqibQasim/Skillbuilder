const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "PurchasedCourse",
  name: "purchasedCourse",
  tableName: "purchased_course",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    user_id: {
      type: "int",
    },
    course_id: {
      type: "int",
    },
    purchase_date: {
      type: "timestamp",
    },
    amount_paid: {
      type: "int",
    },

    watched_length: {
      type: "int",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one", // Each PurchasedCourse belongs to one User
      joinColumn: {
        name: "user_id",
      },
    },
    course: {
      target: "Course",
      type: "many-to-one", // Each PurchasedCourse belongs to one Course
      joinColumn: {
        name: "course_id",
      },
    },
  },
});
