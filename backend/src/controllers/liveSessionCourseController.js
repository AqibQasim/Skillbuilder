const liveSessionCourseService= require('../services/liveSessionCourseService');

const createLiveSessionCourse= async(req,res)=>{
    const result= await liveSessionCourseService.createLiveSessionCourse(req)
    return res.status(result?.status).send({...result})
}

module.exports={createLiveSessionCourse}