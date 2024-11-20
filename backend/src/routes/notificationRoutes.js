const notificationController = require("../controllers/notificationController");


const notificationRoutes= async(fastify,options)=>{
    //fastify.get('/check-notifications',getnotificationController);
    fastify.post('/create-notification', notificationController.createNotification);
    fastify.get('/get-notification', notificationController.getNotification);
    fastify.post('/subscribe', notificationController.subscribe)
}

module.exports={
    notificationRoutes
}