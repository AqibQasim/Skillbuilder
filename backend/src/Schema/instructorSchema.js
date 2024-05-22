const createInstructorSchema = {
    schema: {
        description: "Create a new instructor",
        tags: ["instructor"],
        summary: "Create instructor",
        body: {
            type: "object",
            properties: {
                experience: { type: "array", items: { type: "string" } },
                specialization: { type: "string", },
                video_url: { type: "string", },
                status: { type: "string", enum: ["active", "pending"], default: "pending" },
            },
            required: ["specialization", "video_url"]
        },
        response: {
            201: {
                description: "Instructor created successfully",
                type: "object",
                properties: {
                    id: { type: "integer" },
                    experience: { type: "array", items: { type: "string" } },
                    specialization: { type: "string" },
                    video_url: { type: "string" },
                    status: { type: "string", enum: ["active", "pending"] },
                    created_at: { type: "string", format: "date-time" }
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

// Schema for "/get-all-instructors" route
const getAllInstructorsSchema = {
    schema: {
        description: "Get all instructors",
        tags: ["instructor"],
        summary: "Get all instructors",
        response: {
            200: {
                description: "List of all instructors",
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        specialization: { type: "string" },
                        // Add more properties as needed
                    }
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

// Schema for "/instructor-detail/:id" route
const instructorDetailSchema = {
    schema: {
        description: "Get details of a specific instructor",
        tags: ["instructor"],
        summary: "Get instructor detail",
        params: {
            type: "object",
            properties: {
                id: { type: "string", description: "Instructor ID" }
            },
            required: ["id"]
        },
        response: {
            200: {
                description: "Details of the instructor",
                type: "object",
                properties: {
                    id: { type: "integer" },
                    name: { type: "string" },
                    specialization: { type: "string" },
                    // Add more properties as needed
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

module.exports = { createInstructorSchema, getAllInstructorsSchema, instructorDetailSchema };



