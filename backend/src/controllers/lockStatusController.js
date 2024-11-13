const { getLockStatusService } = require("../services/lockStatusService");

const getLockStatusController= async(req,res)=>{
    const {course_id,user_id}= req.query;
    const result= await getLockStatusService(user_id,course_id);
    res.status(result.status).send({...result})
}

module.exports={
    getLockStatusController
}
  