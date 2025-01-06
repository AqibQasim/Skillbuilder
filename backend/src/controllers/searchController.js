const searchCourse = require("../services/searchService");

const search= async(req,res)=>{
    const {value,searchBy}= req?.query;
    switch(searchBy){
        case 'course':
            const result= await searchCourse(value);
            res.status(result.status).send({...result});
            break;
        default:
            res.status(400).send({
                status: 400,
                message: "search by required"
            });
            break;
    }
}

module.exports= search;