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
    status: {
      type: "enum",
      enum: ["suspended","active"],
      nullable: true
    },
    status_desc: {
      type: "varchar",
      nullable: true
    },
    profile: {
      type: "varchar",
      nullable: true,
    },
    first_name: {
      type: "varchar",
    },
    last_name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
      nullable: true,
    },
    profession: {
      type: "varchar",
      nullable: true,
    },
    location: {
      type: "varchar",
      nullable: true,
    },
    facebook_profile: {
      type: "varchar",
      nullable: true,
    },
    twitter_profile: {
      type: "varchar",
      nullable: true,
    },
    linkedin_profile: {
      type: "varchar",
      nullable: true,
    },
    is_active: {
      type: "bool",
      default: true,
    },
    role: {
      type: "enum",
      enum: ["student", "tutor"],
      default: "student",
    },
    source: {
      type: "enum",
      enum: ["facebook", "google", "app"],
      default: "app",
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true, 
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "one-to-one",
      inverseSide: "user",
// <<<<<<< HEAD
      joinColumn: true,
    },
    reviews: {
      target: "course_reviews",
      type: "one-to-one",
      inverseSide: "user",
    },
    purchased_courses: {
      target: 'purchased_course',
      type: 'one-to-many'
    }

  },

});
