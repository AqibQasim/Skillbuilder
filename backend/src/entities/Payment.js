const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Payment",
  tableName: "payments",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    order_id: {
      type: "int",
    },
    payment_intent: {
      type: "enum",
      enum: ["purchasing a course", "plans"],
      default: "plans",
    },
    amount: {
      type: "decimal",
    },
    currency: {
      type: "varchar",
    },
    status: {
        type: "enum",
        enum: ["paid", "pending","not paid"],
        default: "not paid",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
  },
  relations: {
    order: {
      target: "Order",
      type: "many-to-one",
      joinColumn: { name: "order_id" },
    },
  },
});
