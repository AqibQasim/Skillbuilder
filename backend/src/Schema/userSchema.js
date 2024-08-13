const Joi = require("joi");
const { EmailVerify } = require("../controllers/userController");
const { query } = require("pg-monitor");

const ValidateUser = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .pattern(
      new RegExp(
        /(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&\#])[A-Za-z\d@$!%*?&\#]{8,}$/
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
      "any.required": "Password is required",
    }),
  profession: Joi.string().optional(),
  source: Joi.string().optional(),
});

const loginValidation = Joi.object({
  email: Joi.string()
    .pattern(
      new RegExp(
        /(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  password: Joi.string().required(),
});

const validateEmailAndPassword = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
      "any.required": "Password is required",
    }),
  email: Joi.string()
    .pattern(
      new RegExp(
        /(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/
      )
    )
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
});

const updateProfileValidation = Joi.object({
  id: Joi.number().required(),
  first_name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string()
    .pattern(
      new RegExp(
        /(\w+|\.+\w+){1,10}@[a-zA-Z0-9]+\.([a-zA-Z0-9]+|\.[a-zA-Z0-9]+){1,3}/
      )
    )
    .messages({
      "string.pattern.base": "Please provide a valid email address",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least one letter, one number, one special character, and be at least 8 characters long",
    }),
  profession: Joi.string(),
  location: Joi.string(),
  twitter_profile: Joi.string(),
  facebook_profile: Joi.string(),
  linkedin_profile: Joi.string(),
});
//student will set his status schema
const setStudentStatusschema = {
  schema: {
    description: "Set Student Status",
    body: {
      type: "object",
      properties: {
        id: {
          type: "integer",
          description: "Unique identifier of the student",
        },
        status: {
          type: "string",
          enum: ["suspended", "active"],
          description:
            "The status of the student. Must be either 'suspended' or 'active'.",
        },
        status_desc: {
          type: "string",
          description: "A description or reason for the status change.",
        },
      },
      required: ["id", "status", "status_desc"],
    },
  },
};

//student will in-roll in course schema
const userEnrollcourseSchema = {
  schema: {
    description: "Enroll in course",
    body: {
      type: "object",
      properties: {
        student_id: { type: "number" },
        course_id: { type: "number" },
        filter: { type: "string" },
      },
      required: ["student_id", "course_id", "filter"],
    },
  },
};
const userSwaggerSchema = {
  schema: {
    description: "post signup data",
    body: {
      type: "object",
      properties: {
        first_name: { type: "string", default: "Jason" },
        last_name: { type: "string", default: "Roy" },
        email: { type: "string", default: "test@gmail.com" },
        password: { type: "string", default: "Password@12345" },
        obj: {
          type: "object",
          properties: {
            some: { type: "string" },
          },
        },
      },
    },
    response: {
      201: {
        description: "Successful response",
        type: "object",
        properties: {
          hello: { type: "string" },
        },
      },
      default: {
        description: "Default response",
        type: "object",
        properties: {
          foo: { type: "string" },
        },
      },
    },
    // security: [
    //   {
    //     apiKey: [],
    //   },
    // ],
  },
};

const loginSchema = {
  schema: {
    description: "User login",
    tags: ["auth"],
    summary: "Login",
    body: {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        password: { type: "string", minLength: 8 },
      },
      required: ["email", "password"], // Make sure to include required properties as an array
    },
    // response: {
    //   200: {
    //     description: "Successful login",
    //     type: "object",
    //     properties: {
    //       token: { type: "string" }
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

// Route: /change-password
const changePasswordSchema = {
  schema: {
    body: {
      type: "object",
      properties: {
        email: { type: "string", format: "email" },
        current_password: { type: "string", required: ["current_password"] }, // Ensure required is defined as an array
        new_password: {
          type: "string",
          required: ["new_password"],
          minLength: 8,
        },
      },
      required: ["email", "current_password", "new_password"], // Define required properties as an array
    },
    // response: {
    //   200: {
    //     description: "Password successfully changed",
    //     type: "object",
    //     properties: {
    //       success: { type: "boolean" },
    //       message: { type: "string" }
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

// Route: /update-profile
const updateProfileSchema = {
  schema: {
    description: "Update user profile",
    tags: ["user"],
    summary: "Update profile",
    body: {
      type: "object",
      properties: {
        id: { type: "number" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        email: { type: "string" },
        password: { type: "string" },
        profession: { type: "string" },
        location: { type: "string" },
        twitter_profile: { type: "string" },
        facebook_profile: { type: "string" },
        linkedin_profile: { type: "string" },
      },
      required: ["id"],
    },
    // response: {
    //   200: {
    //     description: "Profile successfully updated",

    //     content: {
    //       "application/json": {
    //         schema: {
    //           type: "object",
    //           properties: {
    //             profile: { type: "string", nullable: true },
    //             first_name: { type: "string" },
    //             last_name: { type: "string" },
    //             profession: { type: "string", nullable: true },
    //             location: { type: "string", nullable: true },
    //             facebook_profile: { type: "string", nullable: true },
    //             twitter_profile: { type: "string", nullable: true },
    //             linkedin_profile: { type: "string", nullable: true }
    //           }
    //         }
    //       }
    //     }
    //   },
    //   default: {
    //     description: "Unexpected error",
    //     content: {
    //       "application/json": {
    //         schema: {
    //           type: "object",
    //           properties: {
    //             message: { type: "string" }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }
  },
};

// get apis schemas

// /verify-email/:token
// const verifyEmailSchema = {
//   schema: {
//     params: {
//       type: "object",
//       properties: {
//         token: { type: "string", description: "Email verification token" }
//       },
//       required: ["token"]
//     }
//   }
// };

const verifyEmailSchema = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
          description: "User email address",
        },
        token: { type: "string", description: "Email verification token" },
      },
      required: ["email", "token"],
    },
  },
};

// /password-reset/:email
const passwordResetSchema = {
  schema: {
    query: {
      type: "object",
      properties: {
        email: { type: "string", description: "User email for password reset" },
      },
      required: ["email"],
    },
  },
};

// /otp-verification/:phone
const otpVerificationSchema = {
  schema: {
    params: {
      type: "object",
      properties: {
        phone: {
          type: "string",
          description: "User phone number for OTP verification",
        },
      },
      required: ["phone"],
    },
  },
};

// Schema for /auth/google
// const googleAuthSchema = {
//   schema: {
//     querystring: {
//       type: "object",
//       properties: {
//         scope: {
//           type: "array",
//           items: {
//             type: "string"
//           }
//         }
//       },
//       required: ["scope"]
//     }
//   }
// };

// const googleAuthSchema = {
//   schema: {
//     querystring: {
//       type: 'object',
//       properties: {
//         scope: { type: 'string' }
//       },
//       required: ['scope']
//     }
//   }
// };

// Schema for /auth/google/callback
const googleAuthCallbackSchema = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description:
            "The authorization code received from Google after successful login",
        },
      },
      required: ["code"],
    },
  },
};

const getAllUsersSchema = {
  schema: {
    description: "Get all users",
    tags: ["users"],
    summary: "Get all users",
    response: {
      200: {
        description: "Successful response",
        type: "object",
        properties: {
          users: {
            type: "array",
            items: {
              type: "object",
              properties: {
                // Define properties for each user object
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string", format: "email" },
                // Add more properties as needed
              },
            },
          },
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

module.exports = {
  ValidateUser,
  loginValidation,
  validateEmailAndPassword,
  updateProfileValidation,
  userSwaggerSchema,
  verifyEmailSchema,
  loginSchema,
  changePasswordSchema,
  updateProfileSchema,
  passwordResetSchema,
  otpVerificationSchema,
  googleAuthCallbackSchema,
  // googleAuthSchema,
  setStudentStatusschema,
  getAllUsersSchema,
  userEnrollcourseSchema,
};
