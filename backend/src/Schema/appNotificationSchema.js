exports.createNotificationSchema = {
  schema: {
    body: {
      type: "object",
      required: ["title", "message", "recipientId", "recipientType"],
      properties: {
        title: { type: "string", minLength: 1 },
        message: { type: "string", minLength: 1 },
        recipientId: { type: "number" },
        recipientType: {
          type: "string",
          enum: ["admin", "instructor", "student"],
        },
        notificationType: { type: "string", default: "permission" },
      },
    },
    response: {
      201: {
        type: "object",
        properties: {
          status: { type: "number" },
          data: {
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              message: { type: "string" },
              recipientId: { type: "number" },
              recipientType: { type: "string" },
              notificationType: { type: "string" },
              senderId: { type: "number" },
              senderType: { type: "string" },
              isRead: { type: "boolean" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
  },
};

exports.getNotificationsSchema = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        page: { type: "number", default: 1 },
        limit: { type: "number", default: 10 },
        unreadOnly: { type: "boolean", default: false },
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
              notifications: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    title: { type: "string" },
                    message: { type: "string" },
                    recipientId: { type: "number" },
                    recipientType: { type: "string" },
                    notificationType: { type: "string" },
                    senderId: { type: "number" },
                    senderType: { type: "string" },
                    isRead: { type: "boolean" },
                    createdAt: { type: "string", format: "date-time" },
                  },
                },
              },
              pagination: {
                type: "object",
                properties: {
                  total: { type: "number" },
                  currentPage: { type: "number" },
                  totalPages: { type: "number" },
                  limit: { type: "number" },
                },
              },
            },
          },
        },
      },
    },
  },
};

exports.markAsReadSchema = {
  schema: {
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
            },
          },
        },
      },
    },
  },
};

exports.markAllAsReadSchema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          status: { type: "number" },
          data: {
            type: "object",
            properties: {
              updatedCount: { type: "number" },
              userId: { type: "number" },
              userType: { type: "string" },
            },
          },
        },
      },
    },
  },
};
