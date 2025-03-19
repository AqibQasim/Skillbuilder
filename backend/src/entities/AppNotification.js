const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "AppNotification",
  tableName: "app_notifications",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    title: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    message: {
      type: "text",
      nullable: false,
    },
    recipient_id: {
      type: "int",
      nullable: false,
    },
    recipient_type: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    notification_type: {
      type: "varchar",
      length: 50,
      nullable: false,
    },
    sender_id: {
      type: "int",
      nullable: true,
    },
    sender_type: {
      type: "varchar",
      length: 50,
      nullable: true,
    },
    is_read: {
      type: "boolean",
      default: false,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
});
