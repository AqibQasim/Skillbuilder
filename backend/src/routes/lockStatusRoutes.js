const { getLockStatusController } = require("../controllers/lockStatusController")

const lockStatusRoutes= async(fastify,options)=>{
    fastify.get('/check-lock-status',getLockStatusController)
}

module.exports={
    lockStatusRoutes
}