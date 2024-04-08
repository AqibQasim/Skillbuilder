const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "User",
  name: "user",
  tableName: "user",
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
    password: {
      type: "varchar",
    },
    profession: {
      type: 'varchar',
      nullable: true
    },
    location: {
      type: 'varchar',
      nullable: true
    },
    facebook_profile: {
      type: 'varchar',
      nullable: true
    },
    twitter_profile: {
      type: 'varchar',
      nullable: true
    },
    linkedin_profile: {
      type: 'varchar',
      nullable: true
    },
    role: {
      type: 'enum',
      enum: ["admin", "user" ],
      default: 'user'
    },
    source: {
      type: "enum",
      enum: ["facebook", "google", "app"],
      default: "app"
    }
  },
});