const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  target: "Course",
  name: "course",
  tableName: "course",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    instructor_id: {
      type: 'int',
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar"
    },
    creation_duration_hours: {
      type: "int",
    },
    learning_outcomes: {
      type: "varchar"
    },
    category: {
      type: "varchar"
    },
    modulesCount: {
      type: "int"
    },
    amount: {
      type: "decimal",
    },
    discount: {
      type: "decimal",
      default: 0
    },
    charges: {
      type: "decimal",
    },
    active: {
      type: "boolean",
      default: false
    },
    status: {
      type: "enum",
      enum: ['pending', 'approved', 'declined'],
      default: 'pending'
    },
    enrolled_customers: {
      type: "jsonb",
      default: []
    },
    image: {
      type: "varchar",
    },
    rating: {
      type: "decimal",
      precision: 3,
      scale: 1,
      nullable: true
    },
    created_at: {
      type: "timestamp with time zone",
    },
    updated_at: {
      type: "timestamp with time zone",
      nullable: true,
    },
    // created_by: {
    //   type: "integer",
    //   nullable: true,
    // },
    updated_by: {
      type: "varchar",
      nullable: true,
    },
    video_url: {
      type: "varchar"
    },
  },
  relations: {
    instructor: {
      target: "Instructor",
      type: "many-to-one", 
      joinColumn: {
        name: "instructor_id"
      },  
    },
    reviews: {
      target: "course_reviews",
      type: "one-to-many", 
      inverseSide: "course",
    },
    modules: {
      target: "content_module",
      type: "one-to-many",
      inverseSide: "course",
    },
    purchased_course: {
      target: "purchased_course",
      type: "many-to-one", 
      joinColumn: {
        name: "purchased_courses_id"
      },  
    },
  },
});
