const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "live-course",
  name: "live-course",
  tableName: "live-course",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    instructor_id: {
      type: "int",
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    learning_outcomes: {
      type: "jsonb",
      nullable: true,
    },
    category: {
      type: "varchar",
    },
    modulesCount: {
      type: "int",
    },
    amount: {
      type: "decimal",
    },
    discount: {
      type: "decimal",
      default: 0,
    },
    charges: {
      type: "decimal",
    },
    active: {
      type: "boolean",
      default: false,
    },
    level: {
      type: "enum",
      enum: ["beginner", "intermediate", "expert"],
      default: "beginner",
    },
    enrolled_customers: {
      type: "jsonb",
      default: [],
    },
    image: {
      type: "varchar",
      nullable: true,
    },
    rating: {
      type: "decimal",
      precision: 3,
      scale: 1,
      nullable: true,
    },
    updated_at: {
      type: "timestamp with time zone",
      nullable: true,
    },
    reason: {
      type: "enum",
      enum: [
        "Video Quality",
        "Inappropriate Language",
        "Discriminations",
        "Course Curriculum",
      ],
      nullable: true,
    },
    status_desc: {
      type: "jsonb",
      nullable: true,
    },
    updated_by: {
      type: "varchar",
      nullable: true,
    },
    video_url: {
      type: "varchar",
      nullable: true,
    },
    skills: {
      type: "jsonb",
      nullable: true,
      default: null,
    },
    status:{
      type:"enum",
      enum:["pending","approved","declined"],
      default:"pending"
    }
    // live_session_course_id: {
    //   type: "int",
    //   nullable: true,
    //   joinColumn: {
    //     name: "live_session_course_id",
    //     referencedColumnName: "id",
    //   },
    // },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one",
      joinColumn: {
        name: "instructor_id",
      },
    },
    modules: {
      target: "live-content-module",
      type: "one-to-many",
      // joinColumn:{
      //   name:"id"
      // },
      inverseSide: "live_course",
    },
  },
});
