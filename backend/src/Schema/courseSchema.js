const Joi = require("joi");

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
      required: ["instructor_id", "title", "learning_outcomes", "category", "modulesCount", "amount", "charges"]
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
  }
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
        course_id: { type: "integer" } 
      },
      required: ["user_id"] 
    },
    response: {
      200: {
        description: "Course purchased successfully",
        type: "object",
        properties: {
          message: { type: "string" }
        }
      },
      default: {
        description: "Unexpected error",
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  }
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
        id: { type: "integer" }
      },
      required: ["id"]
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
  }
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
  }
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
          }
        }
      }
    }
  }
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
          }
        }
      }
    }
  }
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
        id: { type: "integer" }
      },
      required: ["id"]
    },
    response: {
      200: {
        description: "Course details found successfully",
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          // Add more properties as needed
        }
      },
      404: {
        description: "Course details not found",
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  }
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
        user_id: { type: "integer" }
      },
      required: ["user_id"]
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
          }
        }
      },
      404: {
        description: "User's courses not found",
        type: "object",
        properties: {
          message: { type: "string" }
        }
      }
    }
  }
};




module.exports = { ValidateCourse, createCourseSchema, buyCourseSchema, getCourseByIdSchema, allCoursesSchema, coursesRatingSchema, recentCoursesSchema, courseDetailsSchema, myCoursesSchema };
