const { findOneCourse } = require("../repositories/courseRepository")


async function grantAccess(course_id, student_id){
    try{
        const course = await findOneCourse({ id : course_id});
        return course;
    }
    catch (err) {
        console.log("[ERROR FINDING THE DESIRED COURSE]:",)
    }
}

module.exports = {
    grantAccess
}