const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Contact_us",
  name: "contact_us",
  tableName: "contact_us",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstName: {
      type: "varchar",
    },
    lastName: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    phone: {
      type: "varchar",
    },
    subject: {
      type: "varchar",
    },
    text: {
      type: "varchar",
    },
    source: {
      type: "varchar",
    },
  },
});
