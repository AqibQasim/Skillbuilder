const createInstructorSchema = {
    schema: {
        description: "Create a new instructor",
        tags: ["instructor"],
        summary: "Create instructor",
        // body: {
        //     type: "object",
        //     properties: {
        //         experience: { type: "array", items: { type: "string" } },
        //         specialization: { type: "string", },
        //         video_url: { type: "string", },
        //         status: { type: "string", enum: ["active", "pending"], default: "pending" },
        //         title: { type: "string" },
        //         description: { type: "string" },
        //         tags: { type : "array", items : { type: "string" }}, 
        //         entity: { type: "string" }
        //     },
        //     required: ["specialization", "video_url"]
        // },
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
    }
};

module.exports = { createInstructorSchema, getAllInstructorsSchema, instructorDetailSchema };



