const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Admin",
  tableName: "admin",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    username: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password:{
      type: "varchar",
      nullable: false
    }
  },
});
