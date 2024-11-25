const { getLockStatusService } = require("../services/lockStatusService");

const getLockStatusController= async(req,res)=>{
    const {course_id,user_id, is_admin}= req.query;
    const result= await getLockStatusService(user_id,course_id,is_admin);
    res.status(result.status).send({...result})
}

module.exports={
    getLockStatusController
}
  