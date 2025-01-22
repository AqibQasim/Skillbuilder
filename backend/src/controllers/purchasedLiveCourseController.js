const purchaseLiveCourseDetailsService = require("../services/purchasedLiveCourseService");
const liveCoursePaymentService= require("../services/purchasedLiveCourseService")

const getPurchasedLiveCoursesController = async (req, res) => {
    try{
        const result = await purchaseLiveCourseDetailsService();
          res.status(result.status).send(result);
    }catch(e){
        res.status(500)
        .send({
            status: 500,
            message: e.message
        })
    }
};

module.exports= {getPurchasedLiveCoursesController}
