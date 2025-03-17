// JSON Schema for Fastify route validation

const createPermissionSchema = {
  body: {
    type: "object",
    required: ["instructor_id", "type"],
    properties: {
      instructor_id: { type: "number" },
      type: {
        type: "string",
        enum: ["courses", "live_sessions", "career_counselling"],
      },
    },
    additionalProperties: false,
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            instructor_id: { type: "number" },
            type: { type: "string" },
            status: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    "4xx": {
      type: "object",
      properties: {
        status: { type: "number" },
        message: { type: "string" },
      },
    },
  },
};

const updatePermissionSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "number" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        data: {
          type: "object",
          properties: {
            id: { type: "number" },
            instructor_id: { type: "number" },
            type: { type: "string" },
            status: { type: "string" },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
    "4xx": {
      type: "object",
      properties: {
        status: { type: "number" },
        message: { type: "string" },
      },
    },
  },
};

const historyRequestSchema = {
  querystring: {
    type: "object",
    required: ["instructor_id", "type"],
    properties: {
      instructor_id: { type: "number" },
      type: {
        type: "string",
        enum: ["courses", "live_sessions", "career_counselling"],
      },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              instructor_id: { type: "number" },
              type: { type: "string" },
              status: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    "4xx": {
      type: "object",
      properties: {
        status: { type: "number" },
        message: { type: "string" },
      },
    },
  },
};

const pendingRequestsSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              instructor_id: { type: "number" },
              type: { type: "string" },
              status: { type: "string" },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
              instructor: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  email: { type: "string" },
                  // Add other instructor properties as needed
                },
              },
            },
          },
        },
      },
    },
  },
};

const requestStatsSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        status: { type: "number" },
        data: {
          type: "object",
          properties: {
            byStatus: {
              type: "object",
              properties: {
                pending: { type: "number" },
                approved: { type: "number" },
                rejected: { type: "number" },
                total: { type: "number" },
              },
            },
            byType: {
              type: "object",
              properties: {
                courses: { type: "number" },
                live_sessions: { type: "number" },
                career_counselling: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
};

module.exports = {
  createPermissionSchema,
  updatePermissionSchema,
  historyRequestSchema,
  pendingRequestsSchema,
  requestStatsSchema,
};
