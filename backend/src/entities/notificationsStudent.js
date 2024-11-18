const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "notifications-student",
  name: "notifications-student",
  tableName: "notifications-student",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    notification_title: {
      type: "varchar",
      nullable: true,
    },
    notification_message: {
      type: "varchar",
      nullable: false,
    },
    student_id: {
      type: "int",
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      //inverseSide: "instructor",
      joinColumn: {
        name: "student_id",
        referencedColumnName: "id",
      },
    },
  },
});
