const { findOneCourse } = require("../repositories/courseRepository");
const { findOneUser } = require("../repositories/userRepository");

async function grantAccess(course_id, student_id, youtube) {
    try {
        const course = await findOneCourse({ id: course_id });
        const student = await findOneUser(student_id);
        console.log("[Student Retrieved]:", student);

        if (course && student) {
            try {
                const allContent = course?.modules?.flatMap(module => module?.content);
                const finalArray = allContent?.map((cont) => {
                    const url = new URL(cont.content);
                    return url.pathname.split('/').pop(); 
                });

                console.log("[final array]:",finalArray);

                if (finalArray && student?.email) {
                    for (let videoId of finalArray) {
                        try {
                            const response = await youtube.videos.update({
                                part: 'status',
                                requestBody: {
                                    id: videoId,
                                    status: {
                                        privacyStatus: 'private',
                                        access: {
                                            allowed: [
                                                {
                                                    id: student?.email,
                                                    kind: 'youtube#user',
                                                },
                                            ],
                                        },
                                    },
                                },
                            });
                            console.log(`[VIDEO ACCESS GRANTED]: Video ID ${videoId} granted to ${student.email}. Response:`, response.data);
                        }
                        catch (err) {
                            console.log(`[ERROR GRANTING ACCESS TO THE USER]: Error for Video ID ${videoId}:`, err);
                            return {
                                message: `[ERROR GRANTING ACCESS TO THE USER]: Error for Video ID ${videoId}`,
                                status: 500
                            };
                        }
                    }
                }
                return {
                    message: `Access granted for videos: ${finalArray.join(', ')}`,
                    // message: finalArray,
                    status: 200
                };

            } catch (err) {
                console.log("[ERROR WHILE COLLECTING URLS FROM A COURSE]:", err);
                return {
                    message: "[ERROR WHILE COLLECTING URLS FROM A COURSE]",
                    status: 500
                };
            }
        } else {
            console.log("[COURSE OR STUDENT NOT FOUND]");
            return {
                message: "[COURSE OR STUDENT NOT FOUND]",
                status: 404
            };
        }
    } catch (err) {
        console.log("[ERROR FINDING THE DESIRED COURSE]:", err);
        return {
            message: "[ERROR FINDING THE DESIRED COURSE]",
            status: 500
        };
    }
}

module.exports = {
    grantAccess
};
