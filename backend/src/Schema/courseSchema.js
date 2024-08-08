const Joi = require("joi");
const course = require("../entities/course");

const ValidateCourse = Joi.object({
  instructor_id: Joi.string().required(),
  title: Joi.string().required(),
  creation_duration_hours: Joi.string().required(),
  learning_outcomes: Joi.string().required(),
  category: Joi.string().required(),
  modules: Joi.number().required(),
  discount: Joi.number(),
  image: Joi.string().required(),
  rating: Joi.string().required(),
});

//Update course Status Schema
const courseStatusSchema = {
  schema: {
    description: "Update Course Status",
    body: {
      type: "object",
      properties: {
        course_id: { type: "integer" },
        status: {
          type: "string",
          enum: ["pending", "approved", "declined", "suspended"],
          description: "Status should be of Enum type",
        },
        reason: {
          type: "string",
          enum: [
            "Video Quality",
            "Inappropriate Language",
            "Discriminations",
            "Course Curriculum",
          ],
        },
        status_desc: {
          type: "array",
          items: {
            type: "object",
            properties: {
              module_id: { type: "integer" },
              content_id: { type: "integer" },
              desc: { type: "string" },
            },
            required: ["module_id", "content_id", "desc"],
          },
        },
      },
      required: ["course_id", "status"],
      if: {
        properties: { status: { const: "approved" } },
      },
      then: {
        required: ["course_id", "status"],
      },
      else: {
        required: ["course_id", "status", "reason", "status_desc"],
      },
    },
  },
};

//update course properties schema
const updatecourseSchema = {
  schema: {
    description: "Update course",
    body: {
      type: "object",
      properties: {
        course_id: { type: "integer" },
        filter: {
          type: "string",
          enum: ["status"],
          description: "Filter type which should be 'status'",
        },
        value: {
          type: "string",
          enum: ["pending", "approved", "declined", "suspended"],
          description: "The status value to filter by",
        },
      },
      required: ["course_id", "filter", "value"],
    },
  },
};

//get reviews via  course_id
const getreviewSchema = {
  schema: {
    description: "Get review of course by ID",
    params: {
      type: "object",
      properties: {
        id: { type: "integer" },
      },
      required: ["id"],
    },
  },
};
//post reviews
const postSchema = {
  schema: {
    description: "Post review",
    body: {
      type: "object",
      properties: {
        course_id: { type: "integer" },
        user_id: { type: "integer" },
        rating: { type: "number", minimum: 1, maximum: 10 },
        review: { type: "string" },
      },
      required: ["course_id", "user_id", "rating", "review"],
    },
  },
};

const createCourseSchema = {
  schema: {
    description: "Create a new course",
    // tags: ["course"],
    // summary: "Create course",
    body: {
      type: "object",
      properties: {
        instructor_id: { type: "integer" },
        title: { type: "string" }, // Removed 'required: true'
        learning_outcomes: { type: "string" },
        category: { type: "string" },
        modulesCount: { type: "integer" },
        amount: { type: "number" },
        charges: { type: "number" },
      },
      required: [
        "instructor_id",
        "title",
        "learning_outcomes",
        "category",
        "modulesCount",
        "amount",
        "charges",
      ],
    },
    // response: {
    //   201: {
    //     description: "Course created successfully",
    //     type: "object",
    //     properties: {
    //       id: { type: "integer" },
    //       title: { type: "string" },
    //       category: { type: "string" },
    //       amount: { type: "number" },
    //       charges: { type: "number" },
    //     }
    //   },
    //   default: {
    //     description: "Unexpected error",
    //     type: "object",
    //     properties: {
    //       message: { type: "string" }
    //     }
    //   }
    // }
  },
};

const buyCourseSchema = {
  schema: {
    description: "Buy a course",
    tags: ["course"],
    summary: "Buy course",
    body: {
      type: "object",
      properties: {
        user_id: { type: "integer" },
        course_id: { type: "integer" },
      },
      required: ["user_id"],
    },
    response: {
      200: {
        description: "Course purchased successfully",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
      default: {
        description: "Unexpected error",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

// Schema for /get-one-course/:id:
const getCourseByIdSchema = {
  schema: {
    description: "Get course by ID",
    tags: ["course"],
    summary: "Get course details by ID",
    params: {
      type: "object",
      properties: {
        id: { type: "integer" },
      },
      required: ["id"],
    },
    // response: {
    //   200: {
    //     description: "Course found",
    //     type: "object",
    //     properties: {
    //       id: { type: "integer" },
    //       title: { type: "string" },
    //       // Add more properties as needed
    //     }
    //   },
    //   404: {
    //     description: "Course not found",
    //     type: "object",
    //     properties: {
    //       message: { type: "string" }
    //     }
    //   }
    // }
  },
};

// Schema for /all-courses:
const allCoursesSchema = {
  schema: {
    description: "Get all courses",
    tags: ["course"],
    summary: "Get all courses",
    // response: {
    //   200: {
    //     description: "List of all courses",
    //     type: "array",
    //     items: {
    //       type: "object",
    //       properties: {
    //         id: { type: "integer" },
    //         title: { type: "string" },
    //         // Add more properties as needed
    //       }
    //     }
    //   }
    // }
  },
};

// Schema for /courses-rating:
const coursesRatingSchema = {
  schema: {
    description: "Get ratings of all courses",
    tags: ["course"],
    summary: "Get ratings of all courses",
    response: {
      200: {
        description: "List of ratings for all courses",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            rating: { type: "number" },
            // Add more properties as needed
          },
        },
      },
    },
  },
};

// Schema for /recent-courses:
const recentCoursesSchema = {
  schema: {
    description: "Get list of recent courses",
    tags: ["course"],
    summary: "Get recent courses",
    response: {
      200: {
        description: "List of recent courses",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            // Add more properties as needed
          },
        },
      },
    },
  },
};

// Schema for /course-details/:id:
const courseDetailsSchema = {
  schema: {
    description: "Get details of a course by ID",
    tags: ["course"],
    summary: "Get course details by ID",
    params: {
      type: "object",
      properties: {
        id: { type: "integer" },
      },
      required: ["id"],
    },
    response: {
      200: {
        description: "Course details found successfully",
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          // Add more properties as needed
        },
      },
      404: {
        description: "Course details not found",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

// Schema for /my-courses/:user_id:
const myCoursesSchema = {
  schema: {
    description: "Get courses of a user by user ID",
    tags: ["course"],
    summary: "Get user's courses by user ID",
    params: {
      type: "object",
      properties: {
        user_id: { type: "integer" },
      },
      required: ["user_id"],
    },
    response: {
      200: {
        description: "List of user's courses",
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            // Add more properties as needed
          },
        },
      },
      404: {
        description: "User's courses not found",
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

module.exports = {
  ValidateCourse,
  createCourseSchema,
  buyCourseSchema,
  getCourseByIdSchema,
  allCoursesSchema,
  coursesRatingSchema,
  recentCoursesSchema,
  courseDetailsSchema,
  myCoursesSchema,
  postSchema,
  getreviewSchema,
  updatecourseSchema,
  courseStatusSchema,
};
