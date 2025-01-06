const dataSource = require("../../Infrastructure/postgres");

const courseRepository = dataSource.getRepository("Course");

const searchCourse= async(courseName)=>{
    if (!courseName) {
        return null;
    }

    const courses = await courseRepository
        .createQueryBuilder("course")
        .leftJoinAndSelect("course.instructor","instructor")
        .where("course.title ILIKE :courseName", { courseName: `%${courseName}%` })
        .andWhere("course.status='approved'")
        .getMany();

    if(courses?.length===0){
        return {
            status: 404,
            message:"course not found",
        }
    }

    return {
        status: 200,
        message: "course found",
        data: courses[0]
    };
}

module.exports= searchCourse;