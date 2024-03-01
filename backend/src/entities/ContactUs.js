const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Contact_us",
  name: "Contact_us",
  tableName: "Contact_us",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    FirstName: {
      type: "varchar",
    },
    LastName: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    Phone: {
      type: "varchar",
    },
    Subject: {
      type: "varchar",
    },
    Text: {
      type: "varchar",
    },
    Here_From: {
      type: "varchar",
    },
  },
});
