const { getEnrolledStudentsService } = require('../services/userService');


const checkIfUserIsStudent = async ({ id }) => {
    try {

        const enrolledStudents = await getEnrolledStudentsService();
        console.log("enrolled students:", enrolledStudents);
        let requestedUser;

        enrolledStudents.forEach((stud) => {
            console.log("[student]:", stud);
            if (stud?.id === id) {
                requestedUser = stud
            }
        });

        if (!requestedUser) {
            console.log("[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]");
            return {
                message: "[REQUESTED USER IS NOT ENROLLED IN ANY COURSE]",
                status: 400
            }
        } else {
            console.log("[REQUESTED USER THAT IS ENROLLED IN A COURSE]:", requestedUser);
            return {
                message: "[REQUESTED USER THAT IS ENROLLED IN A COURSE]:", requestedUser,
                status: 200
            }
        }

    } catch (err) {
        console.log("[SOME ERROR OCCURED WHILE CHANGING THE STATUS]:", err);
        return {
            message: "[SOME ERROR OCCURED WHILE CHANGING THE STATUS]",
            status: 500
        }
    }
}

module.exports = {
    checkIfUserIsStudent
}