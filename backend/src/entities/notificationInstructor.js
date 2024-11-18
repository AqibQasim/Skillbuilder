const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "notifications-instructor",
  name: "notifications-instructor",
  tableName: "notifications-instructor",
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
    instructor_id: {
      type: "int",
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      //inverseSide: "instructor",
      joinColumn: {
        name: "instructor_id",
        referencedColumnName: "id",
      },
    },
  },
});
