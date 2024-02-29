const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "GoogleAuth",
  name: "GoogleAuth",
  tableName: "GoogleAuth",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    verified: {
      type: "boolean",
    }
  },
})
