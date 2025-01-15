const dataSource = require("../../Infrastructure/postgres");

const liveSessionCourseRepository= dataSource.getRepository('live-course');
const liveSessionCourseModuleRepository = dataSource.getRepository('live-content-module');

const createLiveSessionCourse = async(req) => {
  const {
    instructor_id,
    title,
    description,
    category,
    amount,
    discount,
    image,
    video_url,
    modulesCount,
    modules,
  } = req.body;

  try{
      const liveSessionCourses= liveSessionCourseRepository.create({
        instructor_id,
        title,
        description,
        category,
        amount,
        discount,
        image,
        video_url,
        modulesCount,
        charges: 0
        //modules
      });

      const savedLiveSessionCourse= await liveSessionCourseRepository.save(liveSessionCourses);
      
      if(savedLiveSessionCourse){
        for(let module of modules){
            const liveSessionCourseModule= liveSessionCourseModuleRepository.create({
              title: module?.title,
              description: module?.description,
              live_session_course_id: savedLiveSessionCourse?.id
            })
            const savedLiveSessionCourseModule= await liveSessionCourseModuleRepository.save(liveSessionCourseModule);
            if(savedLiveSessionCourseModule){
                return {
                  status: 200,
                  message: "Live courses created successfully"
                }
            }
        }
      }

      return {
        status: 400,
        message: "Course not created"
      }
  }catch(e){
    console.log(e)
    return {
        status: 500,
        message: e.message
    }
  }
};

module.exports = { createLiveSessionCourse };
